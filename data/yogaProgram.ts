export interface YogaWeek {
  week: number; // 1..52
  theme: string;
  coreSutras: string;
  keyIdea: string;
  weeklyPractice: string;
}

export const DAYS_PER_WEEK = 7;
export const TOTAL_WEEKS = 52;
export const TOTAL_DAYS = DAYS_PER_WEEK * TOTAL_WEEKS;

export const YOGA_PROGRAM: YogaWeek[] = [
  {
    week: 1,
    theme: "What is Yoga?",
    coreSutras: "I.1–I.2",
    keyIdea: "Yoga as cessation of mental fluctuations.",
    weeklyPractice:
      "Contemplate yoga as stilling the mind; 1–3 times per day pause for 1 minute to notice and label what the mind is doing; briefly note the dominant mental pattern in the evening.",
  },
  // TODO: add weeks 2–52 in a dedicated prompt.
];

export function getYogaWeek(weekNumber: number): YogaWeek | undefined {
  return YOGA_PROGRAM.find((w) => w.week === weekNumber);
}

/**
 * Given a 1-based global dayNumber (1..TOTAL_DAYS),
 * return the corresponding YogaWeek.
 */
export function getWeekForDay(dayNumber: number): YogaWeek | undefined {
  if (dayNumber < 1 || dayNumber > TOTAL_DAYS) return undefined;
  const zeroBased = dayNumber - 1;
  const index = Math.floor(zeroBased / DAYS_PER_WEEK);
  return YOGA_PROGRAM[index];
}

/**
 * Given a 1-based global dayNumber (1..TOTAL_DAYS),
 * return the 1-based day index within its week (1..7).
 */
export function getDayIndexInWeek(dayNumber: number): number | undefined {
  if (dayNumber < 1 || dayNumber > TOTAL_DAYS) return undefined;
  const zeroBased = dayNumber - 1;
  return (zeroBased % DAYS_PER_WEEK) + 1;
}

if (process.env.NODE_ENV !== "production") {
  // Basic sanity checks for the static program.
  if (YOGA_PROGRAM.length > 0) {
    const weeks = YOGA_PROGRAM.map((w) => w.week);
    const uniqueWeeks = new Set(weeks);
    if (weeks.length !== uniqueWeeks.size) {
      // eslint-disable-next-line no-console
      console.warn(
        "[YogaProgram] Duplicate week numbers found in YOGA_PROGRAM."
      );
    }
  }
}

