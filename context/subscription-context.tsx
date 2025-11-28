"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { doc, getDoc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase/client";
import { useAuth } from "./auth-context";
import { useAppStatus } from "./app-status-context";
import { createLogger } from "../lib/logger";

const logger = createLogger("Subscription");

export type SubscriptionStatus = "none" | "trial" | "active" | "expired";

const TRIAL_WEEKS = 4;
const TRIAL_DAYS = TRIAL_WEEKS * 7; // 28 days

interface SubscriptionContextValue {
  status: SubscriptionStatus;
  isTrialActive: boolean;
  isActivePaid: boolean;
  isExpired: boolean;
  canEditJourney: boolean;
  canAccessDay: (dayNumber: number) => boolean;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { setLastError } = useAppStatus();
  const [status, setStatus] = useState<SubscriptionStatus>("none");
  const [subLoading, setSubLoading] = useState<boolean>(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !user.emailVerified) {
      setStatus("none");
      setSubLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    let unsub: (() => void) | null = null;

    const init = async () => {
      setSubLoading(true);

      // First check if the doc exists; if not, create a trial doc
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const now = new Date();

        await setDoc(userRef, {
          subscriptionStatus: "trial",
          trialStartedAt: Timestamp.fromDate(now),
          createdAt: Timestamp.fromDate(now),
          updatedAt: Timestamp.fromDate(now),
        });
      }

      // Subscribe to updates
      unsub = onSnapshot(
        userRef,
        (docSnap) => {
          if (!docSnap.exists()) {
            setStatus("none");
            setSubLoading(false);
            return;
          }

          const data = docSnap.data() as {
            subscriptionStatus?: SubscriptionStatus;
          };

          const rawStatus = data.subscriptionStatus ?? "none";

          // Trial status never expires by time - it's content-based
          const normalizedStatus: SubscriptionStatus =
            rawStatus === "active"
              ? "active"
              : rawStatus === "trial"
              ? "trial"
              : rawStatus;

          setStatus(normalizedStatus);
          setSubLoading(false);
        },
        (error) => {
          logger.warn("onSnapshot error", error, { action: "subscribeToUserDoc", userId: user.uid });
          setLastError("Failed to sync with server. Working from local copy.");
          setStatus("none");
          setSubLoading(false);
        }
      );
    };

    init();

    return () => {
      if (unsub) unsub();
    };
  }, [authLoading, user?.uid, setLastError]);

  // Content-based access check: trial users can access days 1-28 (weeks 1-4)
  const canAccessDay = (dayNumber: number): boolean => {
    if (status === "active") return true;
    if (status === "trial") return dayNumber <= TRIAL_DAYS;
    return false; // expired or none
  };

  const isActivePaid = status === "active";
  const isTrialActive = status === "trial";
  const isExpired = status === "expired" || (!isActivePaid && !isTrialActive);
  // canEditJourney is now content-agnostic - use canAccessDay(dayNumber) for day-specific checks
  const canEditJourney = isActivePaid || isTrialActive;

  const value: SubscriptionContextValue = {
    status,
    isTrialActive,
    isActivePaid,
    isExpired,
    canEditJourney,
    canAccessDay,
    loading: subLoading || authLoading,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return ctx;
}

