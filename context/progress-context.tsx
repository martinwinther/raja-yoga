"use client";

import * as React from "react";
import { DayProgress, WeekProgress, AppSettings } from "../types/app";
import { TOTAL_DAYS, TOTAL_WEEKS } from "../data/yogaProgram";
import { db } from "../lib/firebase/client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./auth-context";
import { useAppStatus } from "./app-status-context";
import { createLogger } from "../lib/logger";

const logger = createLogger("Progress");
import { useSubscription } from "./subscription-context";

export interface ProgressState {
  dayProgress: Record<number, DayProgress>;
  weekProgress: Record<number, WeekProgress>;
  settings: AppSettings;
}

type ProgressAction =
  | { type: "TOGGLE_DAY_PRACTICE"; dayNumber: number }
  | { type: "UPDATE_DAY_NOTE"; dayNumber: number; note: string }
  | { type: "TOGGLE_WEEK_COMPLETED"; week: number }
  | { type: "TOGGLE_WEEK_ENJOYED"; week: number }
  | { type: "TOGGLE_WEEK_BOOKMARKED"; week: number }
  | { type: "UPDATE_WEEK_REFLECTION"; week: number; note: string }
  | { type: "SET_START_DATE"; date: string | null }
  | { type: "RESET_ALL" }
  | { type: "HYDRATE_FROM_STORAGE"; payload: ProgressState };

interface ProgressContextValue extends ProgressState {
  dispatch: React.Dispatch<ProgressAction>;
}

const ProgressContext = React.createContext<ProgressContextValue | null>(null);

export const PROGRESS_STORAGE_KEY = "dailysutra-progress-v1";

const initialState: ProgressState = {
  dayProgress: {},
  weekProgress: {},
  settings: {
    startDate: null,
  },
};

function ensureValidDayNumber(dayNumber: number): number {
  if (dayNumber < 1) return 1;
  if (dayNumber > TOTAL_DAYS) return TOTAL_DAYS;
  return dayNumber;
}

function ensureValidWeek(week: number): number {
  if (week < 1) return 1;
  if (week > TOTAL_WEEKS) return TOTAL_WEEKS;
  return week;
}

function progressReducer(
  state: ProgressState,
  action: ProgressAction
): ProgressState {
  switch (action.type) {
    case "HYDRATE_FROM_STORAGE":
      return action.payload;

    case "TOGGLE_DAY_PRACTICE": {
      const dayNumber = ensureValidDayNumber(action.dayNumber);
      const current = state.dayProgress[dayNumber];
      const didPractice = !current?.didPractice;

      return {
        ...state,
        dayProgress: {
          ...state.dayProgress,
          [dayNumber]: {
            dayNumber,
            didPractice,
            note: current?.note ?? "",
          },
        },
      };
    }

    case "UPDATE_DAY_NOTE": {
      const dayNumber = ensureValidDayNumber(action.dayNumber);
      const current = state.dayProgress[dayNumber];

      return {
        ...state,
        dayProgress: {
          ...state.dayProgress,
          [dayNumber]: {
            dayNumber,
            didPractice: current?.didPractice ?? false,
            note: action.note,
          },
        },
      };
    }

    case "TOGGLE_WEEK_COMPLETED": {
      const week = ensureValidWeek(action.week);
      const current = state.weekProgress[week];

      return {
        ...state,
        weekProgress: {
          ...state.weekProgress,
          [week]: {
            week,
            completed: !current?.completed,
            enjoyed: current?.enjoyed ?? false,
            bookmarked: current?.bookmarked ?? false,
            reflectionNote: current?.reflectionNote ?? "",
          },
        },
      };
    }

    case "TOGGLE_WEEK_ENJOYED": {
      const week = ensureValidWeek(action.week);
      const current = state.weekProgress[week];
      const enjoyed = !current?.enjoyed;

      return {
        ...state,
        weekProgress: {
          ...state.weekProgress,
          [week]: {
            week,
            completed: current?.completed ?? false,
            enjoyed,
            bookmarked: current?.bookmarked ?? enjoyed, // if enjoyed, auto-bookmark
            reflectionNote: current?.reflectionNote ?? "",
          },
        },
      };
    }

    case "TOGGLE_WEEK_BOOKMARKED": {
      const week = ensureValidWeek(action.week);
      const current = state.weekProgress[week];
      const bookmarked = !current?.bookmarked;

      return {
        ...state,
        weekProgress: {
          ...state.weekProgress,
          [week]: {
            week,
            completed: current?.completed ?? false,
            enjoyed: current?.enjoyed ?? false,
            bookmarked,
            reflectionNote: current?.reflectionNote ?? "",
          },
        },
      };
    }

    case "UPDATE_WEEK_REFLECTION": {
      const week = ensureValidWeek(action.week);
      const current = state.weekProgress[week];

      return {
        ...state,
        weekProgress: {
          ...state.weekProgress,
          [week]: {
            week,
            completed: current?.completed ?? false,
            enjoyed: current?.enjoyed ?? false,
            bookmarked: current?.bookmarked ?? false,
            reflectionNote: action.note,
          },
        },
      };
    }

    case "SET_START_DATE": {
      return {
        ...state,
        settings: {
          ...state.settings,
          startDate: action.date,
        },
      };
    }

    case "RESET_ALL":
      return initialState;

    default:
      return state;
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(progressReducer, initialState);
  const prevStateRef = React.useRef<ProgressState>(initialState);
  const { user, loading: authLoading } = useAuth();
  const { setLastError } = useAppStatus();
  const { canAccessDay, status: subscriptionStatus, loading: subscriptionLoading } = useSubscription();

  // Hydrate from localStorage once on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as ProgressState;

      // Basic defensive check
      if (parsed && typeof parsed === "object") {
        dispatch({ type: "HYDRATE_FROM_STORAGE", payload: parsed });
      }
    } catch (error) {
      logger.warn("Failed to parse localStorage state", error, { action: "hydrateFromStorage" });
    }
  }, []);

  // Persist to localStorage when state changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const serialized = JSON.stringify(state);
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, serialized);
    } catch (error) {
      logger.warn("Failed to write localStorage state", error, { action: "persistToStorage" });
    }
  }, [state]);

  // Firestore hydration once we know auth state
  React.useEffect(() => {
    if (authLoading || subscriptionLoading) return;
    if (!user || !user.emailVerified) return;

    const run = async () => {
      try {
        const journeyRef = doc(
          db,
          "users",
          user.uid,
          "journeys",
          "dailysutra-v1"
        );
        const snap = await getDoc(journeyRef);
        if (snap.exists()) {
          const data = snap.data() as Partial<ProgressState>;
          if (data && data.dayProgress && data.weekProgress && data.settings) {
            dispatch({
              type: "HYDRATE_FROM_STORAGE",
              payload: {
                dayProgress: data.dayProgress,
                weekProgress: data.weekProgress,
                settings: data.settings,
              },
            });
          }
        } else {
          // Initialize journey doc from current local state
          // Filter data based on subscription access
          const filteredDayProgress: Record<number, DayProgress> = {};
          const filteredWeekProgress: Record<number, WeekProgress> = {};

          Object.keys(state.dayProgress).forEach((dayKey) => {
            const dayNumber = Number(dayKey);
            if (canAccessDay(dayNumber)) {
              filteredDayProgress[dayNumber] = state.dayProgress[dayNumber];
            }
          });

          const maxWeek = subscriptionStatus === "active" ? TOTAL_WEEKS : 4;
          Object.keys(state.weekProgress).forEach((weekKey) => {
            const weekNumber = Number(weekKey);
            if (weekNumber >= 1 && weekNumber <= maxWeek) {
              filteredWeekProgress[weekNumber] = state.weekProgress[weekNumber];
            }
          });

          await setDoc(journeyRef, {
            dayProgress: filteredDayProgress,
            weekProgress: filteredWeekProgress,
            settings: state.settings,
            programKey: "dailysutra-v1",
            programVersion: "1",
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error: any) {
        logger.warn("Failed to hydrate from Firestore", error, { 
          action: "hydrateFromFirestore",
          userId: user.uid 
        });
        const isPermissionDenied = error?.code === "permission-denied";
        setLastError(
          isPermissionDenied
            ? "Access denied. Please check your subscription status."
            : "Failed to sync with server. Working from local copy."
        );
      }
    };

    run();
    // we only want to run on first auth resolution or when user changes,
    // not on every state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, subscriptionLoading, user?.uid, setLastError, canAccessDay, subscriptionStatus]);

  // Firestore persistence on state changes
  React.useEffect(() => {
    if (authLoading || subscriptionLoading) return;
    if (!user || !user.emailVerified) return;

    const journeyRef = doc(db, "users", user.uid, "journeys", "dailysutra-v1");

    const run = async () => {
      try {
        // Filter dayProgress and weekProgress based on subscription access
        // Only write data the user is allowed to access
        const filteredDayProgress: Record<number, DayProgress> = {};
        const filteredWeekProgress: Record<number, WeekProgress> = {};

        // Filter days based on subscription
        Object.keys(state.dayProgress).forEach((dayKey) => {
          const dayNumber = Number(dayKey);
          if (canAccessDay(dayNumber)) {
            filteredDayProgress[dayNumber] = state.dayProgress[dayNumber];
          }
        });

        // Filter weeks based on subscription
        // Trial users can access weeks 1-4, active users can access all weeks
        const maxWeek = subscriptionStatus === "active" ? TOTAL_WEEKS : 4;
        Object.keys(state.weekProgress).forEach((weekKey) => {
          const weekNumber = Number(weekKey);
          if (weekNumber >= 1 && weekNumber <= maxWeek) {
            filteredWeekProgress[weekNumber] = state.weekProgress[weekNumber];
          }
        });

        await setDoc(
          journeyRef,
          {
            dayProgress: filteredDayProgress,
            weekProgress: filteredWeekProgress,
            settings: state.settings,
            programKey: "dailysutra-v1",
            programVersion: "1",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error: any) {
        logger.warn("Failed to persist to Firestore", error, { 
          action: "persistToFirestore",
          userId: user.uid 
        });
        const isPermissionDenied = error?.code === "permission-denied";
        // Don't show error for permission-denied during normal operation
        // Client-side validation should prevent this, but if it happens,
        // we silently fail and keep working locally
        if (!isPermissionDenied) {
          setLastError("Failed to sync with server. Working from local copy.");
        }
      }
    };

    run();
  }, [
    authLoading,
    subscriptionLoading,
    user?.uid,
    state.dayProgress,
    state.weekProgress,
    state.settings,
    setLastError,
    canAccessDay,
    subscriptionStatus,
  ]);

  // Track analytics for practice and week completions
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const prevState = prevStateRef.current;
    
    // Track practice completions
    Object.keys(state.dayProgress).forEach((dayKey) => {
      const dayNumber = Number(dayKey);
      const current = state.dayProgress[dayNumber];
      const previous = prevState.dayProgress[dayNumber];
      
      // Track when practice is marked as complete (was false, now true)
      if (current?.didPractice && !previous?.didPractice) {
        const { getWeekForDay } = require("../data/yogaProgram");
        const weekNumber = getWeekForDay(dayNumber);
        const { trackPracticeComplete } = require("../lib/firebase/analytics");
        trackPracticeComplete(dayNumber, weekNumber);
      }
    });

    // Track week completions
    Object.keys(state.weekProgress).forEach((weekKey) => {
      const weekNumber = Number(weekKey);
      const current = state.weekProgress[weekNumber];
      const previous = prevState.weekProgress[weekNumber];
      
      // Track when week is marked as complete (was false, now true)
      if (current?.completed && !previous?.completed) {
        const { trackWeekComplete } = require("../lib/firebase/analytics");
        trackWeekComplete(weekNumber);
      }
    });

    prevStateRef.current = state;
  }, [state]);

  const value: ProgressContextValue = React.useMemo(
    () => ({
      ...state,
      dispatch,
    }),
    [state]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = React.useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return ctx;
}

