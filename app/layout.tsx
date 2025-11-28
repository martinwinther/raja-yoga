import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { MainNav } from "../components/main-nav";
import { AppStatusBanner } from "../components/app-status-banner";
import { SkipLink } from "../components/skip-link";
import { KeyboardShortcuts } from "../components/keyboard-shortcuts";
import { Footer } from "../components/footer";
import { CookieConsent } from "../components/cookie-consent";
import { CookieConsentProvider } from "../context/cookie-consent-context";
import { AuthProvider } from "../context/auth-context";
import { SubscriptionProvider } from "../context/subscription-context";
import { ProgressProvider } from "../context/progress-context";
import { AppStatusProvider } from "../context/app-status-context";
import { NotificationProvider } from "../context/notification-context";

export const metadata: Metadata = {
  title: "Daily Sutra",
  description:
    "A 52-week guided journey through the Yoga Sūtras with daily micro-practices, notes, and progress tracking.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon.ico", sizes: "any" },
      { url: "/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Daily Sutra",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
  openGraph: {
    title: "Daily Sutra",
    description:
      "A 52-week guided journey through the Yoga Sūtras with daily micro-practices, notes, and progress tracking.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Daily Sutra",
    description:
      "A 52-week guided journey through the Yoga Sūtras with daily micro-practices, notes, and progress tracking.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#1f2329",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <CookieConsentProvider>
            <AppStatusProvider>
              <AuthProvider>
                <NotificationProvider>
                  <SubscriptionProvider>
                    <ProgressProvider>
                    <div className="flex min-h-screen flex-col">
                      <SkipLink />
                      <KeyboardShortcuts />
                      <header className="glass-nav sticky top-0 z-20" role="banner">
                        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                          <MainNav />
                        </div>
                      </header>
                      <AppStatusBanner />
                      <main id="main-content" className="flex-1" role="main">
                        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
                          {children}
                        </div>
                      </main>
                      <Footer />
                      <CookieConsent />
                    </div>
                    </ProgressProvider>
                  </SubscriptionProvider>
                </NotificationProvider>
              </AuthProvider>
            </AppStatusProvider>
          </CookieConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

