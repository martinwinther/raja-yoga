"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "dailysutra-cookie-consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has been given
    if (typeof window === "undefined") return;

    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid flash on page load
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    localStorage.setItem(`${COOKIE_CONSENT_KEY}-date`, new Date().toISOString());
    setShowBanner(false);
  };

  const handleDecline = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    localStorage.setItem(`${COOKIE_CONSENT_KEY}-date`, new Date().toISOString());
    setShowBanner(false);
    // Note: Declining will break functionality, but we respect user choice
    // The app will still try to use localStorage for essential features
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="mx-auto max-w-5xl">
        <div className="glass-card rounded-2xl border border-[hsla(var(--border),0.3)] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-2">
              <h3
                id="cookie-consent-title"
                className="text-sm font-semibold text-[hsl(var(--text))]"
              >
                Cookie &amp; Storage Consent
              </h3>
              <p
                id="cookie-consent-description"
                className="text-xs text-[hsl(var(--muted))]"
              >
                We use <strong className="text-[hsl(var(--text))]">localStorage</strong> to save
                your journey progress locally and <strong className="text-[hsl(var(--text))]">Firebase cookies</strong> for
                secure authentication. These are essential for the app to function.{" "}
                <Link
                  href="/privacy"
                  className="text-[hsl(var(--accent))] hover:underline"
                >
                  Learn more in our Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={handleAccept}
                className="btn-primary whitespace-nowrap text-xs px-4 py-2"
                aria-label="Accept cookies and storage"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="btn-ghost whitespace-nowrap text-xs px-4 py-2"
                aria-label="Decline cookies and storage"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

