import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { MainNav } from "../components/main-nav";
import { AppStatusBanner } from "../components/app-status-banner";
import { AuthProvider } from "../context/auth-context";
import { SubscriptionProvider } from "../context/subscription-context";
import { ProgressProvider } from "../context/progress-context";
import { AppStatusProvider } from "../context/app-status-context";

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
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Daily Sutra",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#111827",
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
          <AppStatusProvider>
            <AuthProvider>
              <SubscriptionProvider>
                <ProgressProvider>
                  <div className="flex min-h-screen flex-col">
                    <header className="glass-nav sticky top-0 z-20">
                      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                        <MainNav />
                      </div>
                    </header>
                    <AppStatusBanner />
                    <main className="flex-1">
                      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
                        {children}
                      </div>
                    </main>
                  </div>
                </ProgressProvider>
              </SubscriptionProvider>
            </AuthProvider>
          </AppStatusProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

