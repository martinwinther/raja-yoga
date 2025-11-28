"use client";

import { getAnalytics, Analytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { firebaseApp } from "./client";

let analytics: Analytics | null = null;

// Initialize Analytics (client-side only)
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(firebaseApp);
  } catch (error) {
    // Analytics already initialized or not available
    console.warn("Firebase Analytics initialization failed:", error);
  }
}

/**
 * Track a page view
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (!analytics) return;

  try {
    logEvent(analytics, "page_view", {
      page_path: pagePath,
      page_title: pageTitle,
    });
  } catch (error) {
    console.warn("Failed to track page view:", error);
  }
}

/**
 * Track user signup
 */
export function trackSignup(method: "email" = "email") {
  if (!analytics) return;

  try {
    logEvent(analytics, "sign_up", {
      method,
    });
  } catch (error) {
    console.warn("Failed to track signup:", error);
  }
}

/**
 * Track user login
 */
export function trackLogin(method: "email" = "email") {
  if (!analytics) return;

  try {
    logEvent(analytics, "login", {
      method,
    });
  } catch (error) {
    console.warn("Failed to track login:", error);
  }
}

/**
 * Track purchase/conversion
 */
export function trackPurchase(value: number, currency: string = "USD") {
  if (!analytics) return;

  try {
    logEvent(analytics, "purchase", {
      value,
      currency,
    });
  } catch (error) {
    console.warn("Failed to track purchase:", error);
  }
}

/**
 * Track checkout start
 */
export function trackBeginCheckout() {
  if (!analytics) return;

  try {
    logEvent(analytics, "begin_checkout");
  } catch (error) {
    console.warn("Failed to track checkout begin:", error);
  }
}

/**
 * Track practice completion
 */
export function trackPracticeComplete(dayNumber: number, weekNumber: number) {
  if (!analytics) return;

  try {
    logEvent(analytics, "practice_complete", {
      day_number: dayNumber,
      week_number: weekNumber,
    });
  } catch (error) {
    console.warn("Failed to track practice completion:", error);
  }
}

/**
 * Track week completion
 */
export function trackWeekComplete(weekNumber: number) {
  if (!analytics) return;

  try {
    logEvent(analytics, "week_complete", {
      week_number: weekNumber,
    });
  } catch (error) {
    console.warn("Failed to track week completion:", error);
  }
}

/**
 * Set user ID for analytics
 */
export function setAnalyticsUserId(userId: string) {
  if (!analytics) return;

  try {
    setUserId(analytics, userId);
  } catch (error) {
    console.warn("Failed to set analytics user ID:", error);
  }
}

/**
 * Set user properties
 */
export function setAnalyticsUserProperties(properties: {
  subscription_status?: string;
  trial_started?: boolean;
}) {
  if (!analytics) return;

  try {
    setUserProperties(analytics, properties);
  } catch (error) {
    console.warn("Failed to set user properties:", error);
  }
}

/**
 * Track custom event
 */
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (!analytics) return;

  try {
    logEvent(analytics, eventName, parameters);
  } catch (error) {
    console.warn(`Failed to track event ${eventName}:`, error);
  }
}

export { analytics };

