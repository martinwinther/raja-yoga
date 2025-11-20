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
  title: "52 Weeks of Raja Yoga",
  description:
    "A 52-week guided journey through the Yoga Sūtras with daily micro-practices, notes, and progress tracking.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icons/raja-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Raja Yoga",
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
                      <div className="mx-auto flex max-w-5xl items-center px-4 py-3">
                        <div className="flex items-center gap-6">
                          <span className="text-sm font-semibold tracking-wide text-[hsl(var(--text))]">
                            52 Weeks of Raja Yoga
                          </span>
                          <MainNav />
                        </div>
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

