"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { useSubscription } from "../context/subscription-context";
import { trackPageView, setAnalyticsUserId, setAnalyticsUserProperties } from "../lib/firebase/analytics";

/**
 * Analytics Provider Component
 * 
 * Tracks page views and manages user identification for Firebase Analytics
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { status: subscriptionStatus } = useSubscription();

  // Track page views
  useEffect(() => {
    if (pathname) {
      const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      trackPageView(fullPath);
    }
  }, [pathname, searchParams]);

  // Set user ID and properties when user logs in
  useEffect(() => {
    if (user) {
      setAnalyticsUserId(user.uid);
      setAnalyticsUserProperties({
        subscription_status: subscriptionStatus || "none",
      });
    }
  }, [user, subscriptionStatus]);

  return <>{children}</>;
}

