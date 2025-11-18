import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { ThemeToggle } from "../components/theme-toggle";
import { MainNav } from "../components/main-nav";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <header className="glass-nav sticky top-0 z-20">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-semibold tracking-wide text-[hsl(var(--text))]">
                    52 Weeks of Raja Yoga
                  </span>
                  <MainNav />
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="flex-1">
              <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

