/**
 * Date formatting utilities that automatically detect and use the user's locale
 * Falls back to the browser/system locale for appropriate date format
 */

/**
 * Get the user's locale, with fallback to default
 * Works in both client and server contexts
 */
function getUserLocale(): string {
  // Client-side: detect from browser
  if (typeof window !== "undefined") {
    // Try to get locale from Intl API (most reliable)
    try {
      return new Intl.DateTimeFormat().resolvedOptions().locale;
    } catch {
      // Fallback to navigator.language
      if (navigator?.language) {
        return navigator.language;
      }
    }
  }

  // Server-side: default to en-GB (European format)
  // This is a safe default for international use
  return "en-GB";
}

/**
 * Format a date for display using the user's locale
 * Returns null if date is null/undefined
 */
export function formatDate(date: Date | null | undefined, locale?: string): string | null {
  if (!date) return null;
  const userLocale = locale ?? getUserLocale();
  return date.toLocaleDateString(userLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date for display in a long format (e.g., "1 January 2025" or "1. Januar 2025")
 */
export function formatDateLong(date: Date | null | undefined, locale?: string): string {
  if (!date) return "—";
  const userLocale = locale ?? getUserLocale();
  return date.toLocaleDateString(userLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date as a short date string using the user's locale format
 * (e.g., "01/01/2025" for US, "01/01/2025" for UK, "01.01.2025" for DE)
 */
export function formatDateShort(date: Date | null | undefined, locale?: string): string {
  if (!date) return "—";
  const userLocale = locale ?? getUserLocale();
  return date.toLocaleDateString(userLocale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

