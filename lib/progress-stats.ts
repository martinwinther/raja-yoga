import { DayProgress, WeekProgress } from "../types/app";
import { TOTAL_DAYS, TOTAL_WEEKS } from "../data/yogaProgram";

export interface ComputedStats {
  totalDaysWithAnyData: number;
  daysPracticed: number;
  practiceCompletionPercent: number;
  completedWeeks: number;
  bookmarkedWeeks: number;
}

export function computeStats(options: {
  dayProgress: Record<number, DayProgress>;
  weekProgress: Record<number, WeekProgress>;
}): ComputedStats {
  const { dayProgress, weekProgress } = options;

  let daysPracticed = 0;
  let totalDaysWithAnyData = 0;

  for (let dayNumber = 1; dayNumber <= TOTAL_DAYS; dayNumber++) {
    const day = dayProgress[dayNumber];
    if (!day) continue;

    if (day.didPractice) daysPracticed++;

    if (day.didPractice || day.note.trim().length > 0) {
      totalDaysWithAnyData++;
    }
  }

  let completedWeeks = 0;
  let bookmarkedWeeks = 0;

  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    const weekState = weekProgress[week];
    if (!weekState) continue;

    if (weekState.completed) completedWeeks++;
    if (weekState.bookmarked) bookmarkedWeeks++;
  }

  const practiceCompletionPercent =
    TOTAL_DAYS > 0 ? (daysPracticed / TOTAL_DAYS) * 100 : 0;

  return {
    totalDaysWithAnyData,
    daysPracticed,
    practiceCompletionPercent,
    completedWeeks,
    bookmarkedWeeks,
  };
}

export interface DayHistoryItem {
  dayNumber: number;
  didPractice: boolean;
  hasNote: boolean;
}

export function getRecentDayHistory(options: {
  dayProgress: Record<number, DayProgress>;
  count?: number;
}): DayHistoryItem[] {
  const { dayProgress, count = 10 } = options;

  const items: DayHistoryItem[] = [];

  for (let dayNumber = TOTAL_DAYS; dayNumber >= 1; dayNumber--) {
    const day = dayProgress[dayNumber];
    if (!day) continue;

    items.push({
      dayNumber,
      didPractice: day.didPractice,
      hasNote: day.note.trim().length > 0,
    });

    if (items.length >= count) break;
  }

  return items;
}

export interface StreakInfo {
  count: number;
  isActive: boolean;
}

/**
 * Calculate the current practice streak based on actual calendar days.
 * A streak is active if the user has practiced today (including today).
 * The streak counts consecutive calendar days of practice going backwards from today.
 * This ensures the streak reflects actual consecutive practice days, not just
 * sequential day numbers that may have been marked retroactively.
 */
export function calculateStreak(options: {
  dayProgress: Record<number, DayProgress>;
  settings: { startDate: string | null };
  today?: Date;
}): StreakInfo {
  const { dayProgress, settings, today = new Date() } = options;

  // Need start date to map calendar dates to day numbers
  if (!settings.startDate) {
    return { count: 0, isActive: false };
  }

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Helper to get day number for a specific calendar date
  const getDayNumberForDate = (date: Date): number | null => {
    const start = new Date(settings.startDate!);
    if (Number.isNaN(start.getTime())) return null;

    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const checkDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const diffDays = Math.floor((checkDay - startDay) / MS_PER_DAY);
    const dayNumber = diffDays + 1;

    if (dayNumber < 1 || dayNumber > TOTAL_DAYS) {
      return null;
    }

    return dayNumber;
  };

  // Check if today is practiced - if not, streak is not active
  const todayDayNumber = getDayNumberForDate(today);
  if (!todayDayNumber) {
    return { count: 0, isActive: false };
  }

  const todayProgress = dayProgress[todayDayNumber];
  const todayPracticed = todayProgress?.didPractice ?? false;

  if (!todayPracticed) {
    return { count: 0, isActive: false };
  }

  // Count consecutive calendar days going backwards from today
  let streakCount = 0;
  let checkDate = new Date(today);
  checkDate.setHours(0, 0, 0, 0);

  // Check up to a reasonable limit (e.g., 365 days) to avoid infinite loops
  const maxDaysToCheck = 365;
  let daysChecked = 0;

  while (daysChecked < maxDaysToCheck) {
    const dayNumber = getDayNumberForDate(checkDate);
    
    // If day number is out of range or null, we've gone before the start date
    if (!dayNumber) {
      break;
    }

    const day = dayProgress[dayNumber];
    if (day?.didPractice) {
      streakCount++;
      
      // Move to previous calendar day
      checkDate.setTime(checkDate.getTime() - MS_PER_DAY);
      daysChecked++;
    } else {
      // Break when we hit a day without practice
      break;
    }
  }

  return {
    count: streakCount,
    isActive: true, // If we got here, today is practiced
  };
}

