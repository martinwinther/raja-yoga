/**
 * Sharing Utility
 * 
 * Provides sharing functionality with branded messages for:
 * - Daily notes and weekly reflections
 * - Sutras and glossary terms
 * - Progress statistics
 */

/**
 * Get branded footer for shared content
 */
function getBrandedFooter(): string {
  // Include URL so it becomes clickable in most apps
  return "\n\n— Shared from DailySutra.app\nhttps://dailysutra.app\n\nA 52-week journey through the Yoga Sūtras";
}

/**
 * Strip markdown formatting from text
 * Converts markdown to plain text for sharing
 */
function stripMarkdown(text: string): string {
  if (!text) return "";
  
  let result = text;
  
  // Remove code blocks first (before processing other markdown)
  result = result.replace(/```[\s\S]*?```/g, ""); // ```code blocks```
  result = result.replace(/`([^`]+)`/g, "$1"); // `inline code`
  
  // Remove bold markers first (handle **bold** before *italic*)
  // Process multiple times to handle nested or adjacent cases
  let prevResult = "";
  while (result !== prevResult) {
    prevResult = result;
    result = result.replace(/\*\*([^*]+?)\*\*/g, "$1"); // **bold**
    result = result.replace(/__([^_]+?)__/g, "$1"); // __bold__
  }
  
  // Remove italic markers (single asterisk/underscore)
  // Process multiple times to handle all cases
  prevResult = "";
  while (result !== prevResult) {
    prevResult = result;
    result = result.replace(/\*([^*\n]+?)\*/g, "$1"); // *italic* (not spanning newlines)
    result = result.replace(/_([^_\n]+?)_/g, "$1"); // _italic_ (not spanning newlines)
  }
  
  // Remove links but keep text
  result = result.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1"); // [text](url)
  
  // Remove headers
  result = result.replace(/^#{1,6}\s+/gm, ""); // # headers
  
  // Remove horizontal rules
  result = result.replace(/^---+$/gm, "");
  
  // Remove list markers
  result = result.replace(/^[\s]*[-*+]\s+/gm, ""); // - * + list items
  result = result.replace(/^[\s]*\d+\.\s+/gm, ""); // numbered list items
  
  // Clean up extra whitespace (but preserve paragraph breaks)
  result = result.replace(/\n{3,}/g, "\n\n"); // max 2 newlines
  result = result.replace(/[ \t]+/g, " "); // multiple spaces to single space
  result = result.trim();
  
  return result;
}

/**
 * Share content using Web Share API or fallback to clipboard
 */
export async function shareContent(
  content: string,
  title?: string
): Promise<boolean> {
  // Try Web Share API first (mobile and some desktop browsers)
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: title || "DailySutra.app",
        text: content,
      });
      return true;
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.name !== "AbortError") {
        console.warn("[Sharing] Web Share API error:", error);
      }
      // Fall through to clipboard fallback
    }
  }

  // Fallback to clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (error) {
      console.warn("[Sharing] Clipboard write failed:", error);
      return false;
    }
  }

  // Last resort: try to create a temporary textarea and copy
  if (typeof document !== "undefined") {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    } catch (error) {
      console.warn("[Sharing] Fallback copy failed:", error);
      return false;
    }
  }

  return false;
}

/**
 * Format a daily note for sharing
 */
export function formatDailyNoteForSharing(options: {
  weekNumber: number;
  weekTheme: string;
  dayIndex: number;
  dateLabel: string | null;
  note: string;
  didPractice: boolean;
}): string {
  const { weekNumber, weekTheme, dayIndex, dateLabel, note, didPractice } =
    options;

  let content = `Week ${weekNumber}: ${weekTheme}\n`;
  if (dateLabel) {
    content += `Day ${dayIndex} • ${dateLabel}\n`;
  } else {
    content += `Day ${dayIndex}\n`;
  }
  content += "\n";

  if (didPractice) {
    content += "✓ Practiced\n\n";
  }

  content += note;
  content += getBrandedFooter();

  return content;
}

/**
 * Format a weekly reflection for sharing
 */
export function formatWeeklyReflectionForSharing(options: {
  weekNumber: number;
  weekTheme: string;
  reflection: string;
  completed?: boolean;
  enjoyed?: boolean;
  bookmarked?: boolean;
}): string {
  const { weekNumber, weekTheme, reflection, completed, enjoyed, bookmarked } =
    options;

  let content = `Week ${weekNumber}: ${weekTheme}\n`;
  content += "Weekly Reflection\n\n";

  const tags: string[] = [];
  if (completed) tags.push("Completed");
  if (enjoyed) tags.push("Enjoyed");
  if (bookmarked) tags.push("Bookmarked");

  if (tags.length > 0) {
    content += tags.join(" • ") + "\n\n";
  }

  content += reflection;
  content += getBrandedFooter();

  return content;
}

/**
 * Format a sutra for sharing
 */
export function formatSutraForSharing(options: {
  book: string;
  sutraNumber: number;
  title: string;
  sutraText: string;
  commentary?: string;
}): string {
  const { book, sutraNumber, title, sutraText, commentary } = options;

  let content = `${book} ${sutraNumber}`;
  if (title) {
    content += `: ${title}`;
  }
  content += "\n\n";

  // Strip markdown from sutra text
  content += stripMarkdown(sutraText);
  content += "\n\n";

  if (commentary) {
    // Strip markdown from commentary
    content += stripMarkdown(commentary);
    content += "\n\n";
  }

  content += getBrandedFooter();

  return content;
}

/**
 * Format a glossary term for sharing
 */
export function formatGlossaryTermForSharing(options: {
  term: string;
  definition: string;
}): string {
  const { term, definition } = options;

  let content = `${term}\n\n`;
  // Strip markdown from definition
  content += stripMarkdown(definition);
  content += getBrandedFooter();

  return content;
}

/**
 * Format progress stats for sharing (diploma-style message)
 */
export function formatProgressForSharing(options: {
  stats: {
    daysPracticed: number;
    totalDaysWithAnyData: number;
    completedWeeks: number;
    bookmarkedWeeks: number;
    practiceCompletionPercent: number;
  };
  settings: {
    startDate: string | null;
  };
}): string {
  const { stats, settings } = options;

  let content = "📿 DailySutra.app Journey Progress\n\n";

  content += `Days practiced: ${stats.daysPracticed} / 364\n`;
  content += `Weeks completed: ${stats.completedWeeks} / 52\n`;
  content += `Practice completion: ${stats.practiceCompletionPercent.toFixed(1)}%\n`;

  if (stats.bookmarkedWeeks > 0) {
    content += `Bookmarked weeks: ${stats.bookmarkedWeeks}\n`;
  }

  if (stats.totalDaysWithAnyData > 0) {
    content += `Days with notes: ${stats.totalDaysWithAnyData}\n`;
  }

  if (settings.startDate) {
    const startDate = new Date(settings.startDate);
    const formattedDate = startDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    content += `\nJourney started: ${formattedDate}\n`;
  }

  // Add a motivational message based on progress
  if (stats.completedWeeks >= 52) {
    content += "\n🎉 Congratulations! You've completed the full 52-week journey through the Yoga Sūtras.\n";
  } else if (stats.completedWeeks >= 26) {
    content += "\n✨ You're halfway through your journey. Keep going!\n";
  } else if (stats.completedWeeks >= 13) {
    content += "\n🌱 You've completed the first quarter. Well done!\n";
  } else if (stats.daysPracticed > 0) {
    content += "\n🌿 Your practice journey continues. Every day matters.\n";
  }

  content += getBrandedFooter();

  return content;
}

