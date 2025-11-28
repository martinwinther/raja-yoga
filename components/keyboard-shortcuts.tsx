"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/auth-context";

/**
 * Keyboard shortcuts for common navigation actions
 * - ? - Show keyboard shortcuts help
 * - / - Focus search (when available)
 * - n - Next day (on day pages)
 * - p - Previous day (on day pages)
 */
export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      // Alt/Cmd + key combinations
      const isModifier = event.altKey || event.metaKey || event.ctrlKey;

      // Navigation shortcuts (only when not in input)
      if (!isModifier) {
        // Day page navigation
        const dayMatch = pathname.match(/^\/day\/(\d+)$/);
        if (dayMatch) {
          const currentDay = parseInt(dayMatch[1], 10);
          
          if (event.key === "n" || event.key === "N") {
            event.preventDefault();
            if (currentDay < 364) {
              router.push(`/day/${currentDay + 1}`);
            }
            return;
          }
          
          if (event.key === "p" || event.key === "P") {
            event.preventDefault();
            if (currentDay > 1) {
              router.push(`/day/${currentDay - 1}`);
            }
            return;
          }
        }

        // Quick navigation shortcuts
        if (event.key === "h" || event.key === "H") {
          event.preventDefault();
          router.push("/");
          return;
        }

        if (event.key === "s" || event.key === "S") {
          event.preventDefault();
          router.push("/sutras");
          return;
        }

        if (event.key === "g" || event.key === "G") {
          event.preventDefault();
          router.push("/glossary");
          return;
        }

        if (user) {
          if (event.key === "r" || event.key === "R") {
            event.preventDefault();
            router.push("/progress");
            return;
          }

          if (event.key === "," || event.key === "<") {
            event.preventDefault();
            router.push("/settings");
            return;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname, router, user]);

  return null;
}

