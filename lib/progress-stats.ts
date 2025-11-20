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

