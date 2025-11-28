"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "./auth-context";
import { messaging, getFCMToken, onFCMMessage } from "../lib/firebase/client";
import { registerFirebaseMessagingSW } from "../lib/firebase-messaging-sw";
import { config } from "../lib/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase/client";
import { createLogger } from "../lib/logger";

const logger = createLogger("Notifications");

interface NotificationPreferences {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string; // HH:mm format, e.g., "09:00"
  reminderDays: number[]; // 0-6, where 0 is Sunday
}

interface NotificationContextValue {
  permission: NotificationPermission;
  preferences: NotificationPreferences | null;
  loading: boolean;
  requestPermission: () => Promise<boolean>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  token: string | null;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: false,
  dailyReminder: true,
  reminderTime: "09:00",
  reminderDays: [1, 2, 3, 4, 5, 6, 0], // All days
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Register service worker and check notification permission
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("denied");
      setLoading(false);
      return;
    }

    // Register Firebase messaging service worker
    registerFirebaseMessagingSW();

    setPermission(Notification.permission);
    setLoading(false);
  }, []);

  // Load user preferences from Firestore
  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const prefsRef = doc(db, "users", user.uid, "preferences", "notifications");
        const prefsSnap = await getDoc(prefsRef);

        if (prefsSnap.exists()) {
          const data = prefsSnap.data() as NotificationPreferences;
          setPreferences(data);
        } else {
          setPreferences(DEFAULT_PREFERENCES);
        }
      } catch (error) {
        logger.warn("Failed to load notification preferences", error, {
          userId: user.uid,
        });
        setPreferences(DEFAULT_PREFERENCES);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user, authLoading]);

  // Request FCM token when user is authenticated and has permission
  useEffect(() => {
    if (
      authLoading ||
      !user ||
      !messaging ||
      permission !== "granted" ||
      !preferences?.enabled
    ) {
      return;
    }

    // TypeScript: messaging is checked above, but we need to capture it for the async function
    const messagingInstance = messaging;
    if (!messagingInstance) {
      return;
    }

    const requestToken = async () => {
      try {

        const vapidKey = config.firebaseMessaging.vapidKey;
        if (!vapidKey) {
          logger.warn("VAPID key not configured", undefined, { userId: user.uid });
          return;
        }

        const currentToken = await getFCMToken(messagingInstance, {
          vapidKey,
        });

        if (currentToken) {
          setToken(currentToken);
          
          // Save token to Firestore
          try {
            const response = await fetch("/api/notifications/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: currentToken,
                userId: user.uid,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to register token");
            }
          } catch (error) {
            logger.warn("Failed to register FCM token", error, {
              userId: user.uid,
            });
          }
        } else {
          logger.warn("No FCM token available");
        }
      } catch (error: any) {
        logger.warn("Failed to get FCM token", error, {
          userId: user.uid,
          errorCode: error?.code,
        });
      }
    };

    requestToken();
  }, [user, permission, preferences?.enabled, authLoading]);

  // Listen for foreground messages
  useEffect(() => {
    if (!messaging || permission !== "granted") return;

    // TypeScript: messaging is checked above
    const messagingInstance = messaging;
    const unsubscribe = onFCMMessage(messagingInstance, (payload) => {
      logger.info("Foreground message received", { payload });
      
      // Show notification if browser supports it
      if ("Notification" in window && Notification.permission === "granted") {
        const notificationTitle = payload.notification?.title || "Daily Sutra";
        const notificationOptions: NotificationOptions = {
          body: payload.notification?.body || "",
          icon: "/icons/android-chrome-192x192.png",
          badge: "/icons/android-chrome-192x192.png",
          tag: payload.notification?.tag || "daily-reminder",
        };

        new Notification(notificationTitle, notificationOptions);
      }
    });

    return () => unsubscribe();
  }, [permission]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    } catch (error) {
      logger.warn("Failed to request notification permission", error);
      return false;
    }
  }, []);

  const updatePreferences = useCallback(
    async (newPrefs: Partial<NotificationPreferences>) => {
      if (!user) {
        throw new Error("User must be authenticated");
      }

      const updatedPrefs = {
        ...(preferences || DEFAULT_PREFERENCES),
        ...newPrefs,
      };

      try {
        const prefsRef = doc(db, "users", user.uid, "preferences", "notifications");
        await setDoc(prefsRef, updatedPrefs, { merge: true });
        setPreferences(updatedPrefs);
      } catch (error) {
        logger.warn("Failed to update notification preferences", error, {
          userId: user.uid,
        });
        throw error;
      }
    },
    [user, preferences]
  );

  const value: NotificationContextValue = {
    permission,
    preferences,
    loading: loading || authLoading,
    requestPermission,
    updatePreferences,
    token,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
}

