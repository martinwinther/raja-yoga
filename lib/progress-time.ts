import { AppSettings } from "../types/app";
import {
  DAYS_PER_WEEK,
  TOTAL_DAYS,
  getWeekForDay,
  getDayIndexInWeek,
} from "../data/yogaProgram";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function toMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Given AppSettings (with startDate) and an optional "today",
 * return the current 1-based global day number (1..TOTAL_DAYS),
 * or null if startDate is not set or invalid, or if the date is out of range.
 */
export function getCurrentDayNumber(
  settings: AppSettings,
  today: Date = new Date()
): number | null {
  if (!settings.startDate) return null;

  const start = new Date(settings.startDate);
  if (Number.isNaN(start.getTime())) return null;

  const startDay = toMidnight(start).getTime();
  const todayDay = toMidnight(today).getTime();
  const diffDays = Math.floor((todayDay - startDay) / MS_PER_DAY);
  const dayNumber = diffDays + 1; // start date = day 1

  if (dayNumber < 1 || dayNumber > TOTAL_DAYS) {
    return null;
  }

  return dayNumber;
}

/**
 * Return current week number and day index within week (1..7),
 * based on startDate. Returns null if current day number is not valid.
 */
export function getCurrentWeekAndDay(settings: AppSettings): {
  week: number;
  dayIndex: number;
  globalDayNumber: number;
} | null {
  const dayNumber = getCurrentDayNumber(settings);
  if (!dayNumber) return null;

  const week = getWeekForDay(dayNumber);
  const dayIndex = getDayIndexInWeek(dayNumber);
  if (!week || !dayIndex) return null;

  return {
    week: week.week,
    dayIndex,
    globalDayNumber: dayNumber,
  };
}

/**
 * Utility to compute a Date for a given global day number relative
 * to the start date. Returns null if startDate is not set or invalid.
 */
export function getDateForDayNumber(
  settings: AppSettings,
  dayNumber: number
): Date | null {
  if (!settings.startDate) return null;

  const start = new Date(settings.startDate);
  if (Number.isNaN(start.getTime())) return null;

  if (dayNumber < 1 || dayNumber > TOTAL_DAYS) return null;

  const base = toMidnight(start).getTime();
  return new Date(base + (dayNumber - 1) * MS_PER_DAY);
}

