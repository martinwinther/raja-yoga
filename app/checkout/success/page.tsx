"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/client";
import { useAuth } from "../../../context/auth-context";
import { PageHeader } from "../../../components/page-header";
import { GlassCard } from "../../../components/glass-card";

export default function CheckoutSuccessPage() {
  const { user } = useAuth();
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!user || updated) return;

      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            subscriptionStatus: "active",
            updatedAt: new Date(),
            // We could also store "upgradedAt", "stripeStatusHint", etc.
          },
          { merge: true }
        );

        setUpdated(true);
      } catch (err) {
        console.warn("[CheckoutSuccess] Failed to mark active:", err);
        setError("We could not update your subscription status automatically. You can try again later or contact support.");
      }
    };

    run();
  }, [user, updated]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome to the full journey"
        subtitle="Your subscription is active. Thank you for supporting this work."
      />

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          {error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : (
            <p className="text-sm text-[hsl(var(--muted))]">
              Your account has been upgraded. You now have full access to mark
              new practice, edit notes, and continue your journey beyond the
              free trial.
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
