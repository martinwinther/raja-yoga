import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { MainNav } from "../components/main-nav";
import { ProgressProvider } from "../context/progress-context";

export const metadata: Metadata = {
  title: "52 Weeks of Raja Yoga",
  description: "A 52-week Raja Yoga practice journey based on the Yoga Sūtras.",
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
              <main className="flex-1">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
                  {children}
                </div>
              </main>
            </div>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

