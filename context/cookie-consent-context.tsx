"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const COOKIE_NOTICE_KEY = "dailysutra-cookie-notice-dismissed";

interface CookieConsentContextValue {
  noticeDismissed: boolean; // true if user has dismissed the notice
  dismissedDate: string | null;
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const [dismissedDate, setDismissedDate] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed = localStorage.getItem(COOKIE_NOTICE_KEY);
    const date = localStorage.getItem(`${COOKIE_NOTICE_KEY}-date`);

    setNoticeDismissed(dismissed === "true");
    setDismissedDate(date);
  }, []);

  return (
    <CookieConsentContext.Provider value={{ noticeDismissed, dismissedDate }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
}

