"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/client";
import { useAuth } from "../../../context/auth-context";
import { PageHeader } from "../../../components/page-header";
import { GlassCard } from "../../../components/glass-card";
import { createLogger } from "../../../lib/logger";

const logger = createLogger("CheckoutSuccess");

function CheckoutSuccessContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!user || updated) return;

      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setError("Missing session ID. Please contact support if payment was successful.");
        setVerifying(false);
        return;
      }

      try {
        // Verify the session with Stripe first
        const verifyRes = await fetch("/api/verify-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!verifyRes.ok) {
          const verifyData = await verifyRes.json().catch(() => ({}));
          throw new Error(verifyData.error || "Failed to verify payment session");
        }

        const verifyData = (await verifyRes.json()) as {
          verified: boolean;
          firebaseUid: string;
        };

        if (!verifyData.verified || verifyData.firebaseUid !== user.uid) {
          throw new Error("Session verification failed");
        }

        // Only update if verification passed
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            subscriptionStatus: "active",
            upgradedAt: new Date(),
            updatedAt: new Date(),
          },
          { merge: true }
        );

        setUpdated(true);
      } catch (err: any) {
        logger.warn("Failed to verify or update", err, { action: "verifyPayment", sessionId });
        setError(
          err?.message ||
            "We could not verify your payment. The webhook will update your account shortly, or you can contact support."
        );
      } finally {
        setVerifying(false);
      }
    };

    run();
  }, [user, updated, searchParams]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome to the full journey"
        subtitle="Your subscription is active. Thank you for supporting this work."
      />

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          {verifying ? (
            <p className="text-sm text-[hsl(var(--muted))]">
              Verifying your payment...
            </p>
          ) : error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : (
            <p className="text-sm text-[hsl(var(--muted))]">
              Your account has been upgraded. You now have full access to all 52
              weeks of content. You can mark new practice, edit notes, and
              continue your journey beyond the free trial.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              Go to Home
            </Link>
            <Link href="/settings" className="btn-ghost text-xs">
              View subscription in Settings
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <PageHeader
            title="Welcome to the full journey"
            subtitle="Your subscription is active. Thank you for supporting this work."
          />
          <GlassCard>
            <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
              <p className="text-sm text-[hsl(var(--muted))]">
                Loading...
              </p>
            </div>
          </GlassCard>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
