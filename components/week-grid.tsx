"use client";

import Link from "next/link";

import { useProgress } from "../context/progress-context";
import { useSubscription } from "../context/subscription-context";

import {
  DAYS_PER_WEEK,
  TOTAL_WEEKS,
  TOTAL_DAYS,
  YOGA_PROGRAM,
  getGlobalDayNumberFromWeekAndDay,
} from "../data/yogaProgram";

import { GlassCard } from "./glass-card";

import { cn } from "../lib/cn";
import { getCurrentWeekAndDay } from "../lib/progress-time";

export function WeekGrid() {
  const { settings } = useProgress();
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);
  const current = getCurrentWeekAndDay(settings);
  const todayGlobalDayNumber = current?.globalDayNumber ?? null;
  const currentWeek = current?.week ?? null;

  return (
    <section className="space-y-3" aria-labelledby="journey-heading">
      <div className="flex items-center justify-between">
        <h2 id="journey-heading" className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Your journey
        </h2>
        <p className="text-xs text-[hsl(var(--muted))]">
          Tap a day to open its practice and notes.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {weeks.map((weekNumber) => (
          <WeekCard
            key={weekNumber}
            weekNumber={weekNumber}
            todayGlobalDayNumber={todayGlobalDayNumber}
            currentWeek={currentWeek}
          />
        ))}
      </div>

      <p className="mt-1 rounded-lg bg-white/6 px-6 py-2 text-[10px] text-[hsl(var(--muted))] shadow-[0_2px_8px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
        Green squares indicate days where you marked the practice as done.
      </p>
    </section>
  );
}

interface WeekCardProps {
  weekNumber: number;
  todayGlobalDayNumber: number | null;
  currentWeek: number | null;
}

function WeekCard({ weekNumber, todayGlobalDayNumber, currentWeek }: WeekCardProps) {
  const { dayProgress, weekProgress } = useProgress();
  const { canAccessDay } = useSubscription();

  const yogaWeek = YOGA_PROGRAM.find((w) => w.week === weekNumber);

  const weekState = weekProgress[weekNumber];

  const days = Array.from({ length: DAYS_PER_WEEK }, (_, i) => i + 1);

  const isCompleted = weekState?.completed ?? false;

  const isBookmarked = weekState?.bookmarked ?? false;

  const isCurrentWeek = currentWeek !== null && weekNumber === currentWeek;

  return (
    <GlassCard className="week-card">
      <div
        className={cn(
          "-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]",
          isCurrentWeek && "border-2 border-[hsla(var(--accent-soft),0.7)]"
        )}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
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

              const isToday =
                todayGlobalDayNumber !== null &&
                globalDayNumber === todayGlobalDayNumber;

              // Allow clicking on current or past days only
              const isPastOrCurrent =
                todayGlobalDayNumber !== null &&
                globalDayNumber <= todayGlobalDayNumber;

              const canAccess = canAccessDay(globalDayNumber);
              const isLocked = !canAccess || !isPastOrCurrent;

              const dayClassName = cn(
                "flex h-8 w-8 items-center justify-center rounded-xl border text-xs transition-colors",
                isToday
                  ? "border-emerald-400/80 bg-emerald-500/25 text-emerald-50 ring-2 ring-emerald-400/60 ring-offset-1 ring-offset-black/30"
                  : done && canAccess && isPastOrCurrent
                  ? "border-emerald-400/80 bg-emerald-500/25 text-emerald-50"
                  : isLocked
                  ? "border-[hsla(var(--border),0.2)] bg-white/3 text-[hsl(var(--muted))] opacity-40 cursor-not-allowed"
                  : "border-[hsla(var(--border),0.35)] bg-white/6 text-[hsl(var(--muted))] hover:border-[hsla(var(--border),0.7)]"
              );

              const dayTitle =
                isToday
                  ? "Today"
                  : isLocked && !isPastOrCurrent
                  ? "Future day - not yet available"
                  : isLocked
                  ? "Upgrade to access"
                  : undefined;

              if (isLocked) {
                return (
                  <div
                    key={globalDayNumber}
                    className={dayClassName}
                    title={dayTitle}
                    role="img"
                    aria-label={`Day ${dayIndex}${dayTitle ? `: ${dayTitle}` : ""}`}
                  >
                    {dayIndex}
                  </div>
                );
              }

              return (
                <Link
                  key={globalDayNumber}
                  href={`/day/${globalDayNumber}`}
                  className={dayClassName}
                  title={dayTitle}
                  aria-label={`Day ${dayIndex}${dayTitle ? `: ${dayTitle}` : ""}, Week ${weekNumber}`}
                >
                  <span aria-hidden="true">{dayIndex}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

