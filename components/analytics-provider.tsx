"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { useSubscription } from "../context/subscription-context";
import { trackPageView, setAnalyticsUserId, setAnalyticsUserProperties } from "../lib/firebase/analytics";

/**
 * Component that tracks page views with search params
 * Must be wrapped in Suspense because it uses useSearchParams()
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      trackPageView(fullPath);
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Analytics Provider Component
 * 
 * Tracks page views and manages user identification for Firebase Analytics
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { status: subscriptionStatus } = useSubscription();

  // Set user ID and properties when user logs in
  useEffect(() => {
    if (user) {
      setAnalyticsUserId(user.uid);
      setAnalyticsUserProperties({
        subscription_status: subscriptionStatus || "none",
      });
    }
  }, [user, subscriptionStatus]);

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  );
}

