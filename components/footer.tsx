"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[hsla(var(--border),0.2)] bg-[hsla(var(--bg-elevated),0.5)] backdrop-blur-sm" role="contentinfo">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[hsl(var(--text))]">Daily Sutra</p>
              <p className="text-xs text-[hsl(var(--muted))]">
                A 52-week guided journey through the Yoga Sūtras
              </p>
            </div>

            <nav className="flex flex-col gap-4 sm:flex-row sm:gap-8" aria-label="Footer navigation">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
                  Legal
                </p>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-xs text-[hsl(var(--muted))] transition-colors hover:text-[hsl(var(--text))]"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-xs text-[hsl(var(--muted))] transition-colors hover:text-[hsl(var(--text))]"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/refund-policy"
                      className="text-xs text-[hsl(var(--muted))] transition-colors hover:text-[hsl(var(--text))]"
                    >
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
                  Support
                </p>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      href="/contact"
                      className="text-xs text-[hsl(var(--muted))] transition-colors hover:text-[hsl(var(--text))]"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-xs text-[hsl(var(--muted))] transition-colors hover:text-[hsl(var(--text))]"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
                  Studio Projects
                </p>
                <ul className="space-y-1.5">
                  <li>
                    <a
                      href="https://lectiotoday.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[hsl(var(--muted))] transition-colors hover:text-[hsl(var(--text))]"
                    >
                      Lectio Today
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.dailysutra.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[hsl(var(--muted))] transition-colors hover:text-[hsl(var(--text))]"
                    >
                      Daily Sutra
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.asceticjourney.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[hsl(var(--muted))] transition-colors hover:text-[hsl(var(--text))]"
                    >
                      Ascetic Journey
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          <div className="flex flex-col gap-4 border-t border-[hsla(var(--border),0.2)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs text-[hsl(var(--muted))]">
                Built by{" "}
                <a
                  href="https://calmplexity.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[hsl(var(--text))]"
                >
                  calmplexity.com
                </a>
              </p>
              <p className="text-[10px] text-[hsl(var(--muted))]">
                © {currentYear} Calmplexity Studios. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

