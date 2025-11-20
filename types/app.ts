export interface DayProgress {
  dayNumber: number; // 1..364
  didPractice: boolean;
  note: string;
}

export interface WeekProgress {
  week: number; // 1..52
  completed: boolean; // user marked week as completed
  enjoyed: boolean; // user enjoyed this week
  bookmarked: boolean; // user wants to revisit
  reflectionNote: string;
}

export interface AppSettings {
  startDate: string | null; // ISO date string, e.g. "2025-01-01"
}

