"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const COOKIE_CONSENT_KEY = "dailysutra-cookie-consent";

interface CookieConsentContextValue {
  hasConsented: boolean | null; // null = not checked yet, true = accepted, false = declined
  consentDate: string | null;
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [consentDate, setConsentDate] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const date = localStorage.getItem(`${COOKIE_CONSENT_KEY}-date`);

    if (consent === "accepted") {
      setHasConsented(true);
    } else if (consent === "declined") {
      setHasConsented(false);
    } else {
      setHasConsented(null);
    }

    setConsentDate(date);
  }, []);

  return (
    <CookieConsentContext.Provider value={{ hasConsented, consentDate }}>
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

