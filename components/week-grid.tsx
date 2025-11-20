"use client";

import Link from "next/link";

import { useProgress } from "../context/progress-context";

import {
  DAYS_PER_WEEK,
  TOTAL_WEEKS,
  TOTAL_DAYS,
  YOGA_PROGRAM,
  getGlobalDayNumberFromWeekAndDay,
} from "../data/yogaProgram";

import { GlassCard } from "./glass-card";

import { cn } from "../lib/cn";

export function WeekGrid() {
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Your journey
        </h2>
        <p className="text-xs text-[hsl(var(--muted))]">
          Tap a day to open its practice and notes.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {weeks.map((weekNumber) => (
          <WeekCard key={weekNumber} weekNumber={weekNumber} />
        ))}
      </div>

      <p className="mt-1 text-[10px] text-[hsl(var(--muted))]">
        Green squares indicate days where you marked the practice as done.
      </p>
    </div>
  );
}

interface WeekCardProps {
  weekNumber: number;
}

function WeekCard({ weekNumber }: WeekCardProps) {
  const { dayProgress, weekProgress } = useProgress();

  const yogaWeek = YOGA_PROGRAM.find((w) => w.week === weekNumber);

  const weekState = weekProgress[weekNumber];

  const days = Array.from({ length: DAYS_PER_WEEK }, (_, i) => i + 1);

  const isCompleted = weekState?.completed ?? false;

  const isBookmarked = weekState?.bookmarked ?? false;

  return (
    <GlassCard className="flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted))]">
            Week {weekNumber}
          </span>
          <span className="text-sm font-medium text-[hsl(var(--text))]">
            {yogaWeek?.theme ?? "Upcoming theme"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {isCompleted && (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
              Done
            </span>
          )}

          {isBookmarked && (
            <span
              className="text-xs"
              aria-label="Bookmarked week"
              title="Bookmarked week"
            >
              ⭐
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-1">
        <div className="flex flex-1 items-center justify-between gap-1">
          {days.map((dayIndex) => {
            const globalDayNumber =
              getGlobalDayNumberFromWeekAndDay(weekNumber, dayIndex);

            if (!globalDayNumber || globalDayNumber > TOTAL_DAYS) {
              return null;
            }

            const dayState = dayProgress[globalDayNumber];

            const done = dayState?.didPractice ?? false;

            return (
              <Link
                key={globalDayNumber}
                href={`/day/${globalDayNumber}`}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl border text-xs transition-colors",
                  done
                    ? "border-emerald-400/80 bg-emerald-500/20 text-emerald-50"
                    : "border-[hsla(var(--border),0.7)] bg-black/20 text-[hsl(var(--muted))] hover:border-[hsl(var(--accent))]"
                )}
              >
                {dayIndex}
              </Link>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

