"use client";

import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";
import { useProgress } from "../../context/progress-context";
import { useAuth } from "../../context/auth-context";
import { computeStats } from "../../lib/progress-stats";
import { ShareButton } from "../../components/share-button";
import {
  formatDailyNoteForSharing,
  formatWeeklyReflectionForSharing,
  formatProgressForSharing,
} from "../../lib/sharing";
import {
  TOTAL_DAYS,
  TOTAL_WEEKS,
  getWeekForDay,
  getDayIndexInWeek,
  YOGA_PROGRAM,
} from "../../data/yogaProgram";
import { getDateForDayNumber } from "../../lib/progress-time";
import Link from "next/link";

function formatDate(date: Date | null): string | null {
  if (!date) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProgressPage() {
  const { loading: authLoading } = useAuth();
  const { dayProgress, weekProgress, settings } = useProgress();

  const stats = computeStats({ dayProgress, weekProgress });

  const completionPercentLabel = `${stats.practiceCompletionPercent.toFixed(1)}%`;

  const hasAnyData =
    stats.daysPracticed > 0 ||
    stats.totalDaysWithAnyData > 0 ||
    stats.completedWeeks > 0;

  const bookmarkedWeekNumbers = Object.keys(weekProgress)
    .map((w) => Number(w))
    .filter((w) => weekProgress[w]?.bookmarked)
    .sort((a, b) => a - b);

  // Daily notes: all days with a non-empty note, newest first
  const dailyEntries = [];
  for (let dayNumber = 1; dayNumber <= TOTAL_DAYS; dayNumber++) {
    const day = dayProgress[dayNumber];
    if (!day) continue;

    const trimmed = day.note.trim();
    if (!trimmed) continue;

    const week = getWeekForDay(dayNumber);
    const dayIndex = getDayIndexInWeek(dayNumber);
    if (!week || !dayIndex) continue;

    const date = getDateForDayNumber(settings, dayNumber);

    dailyEntries.push({
      dayNumber,
      weekNumber: week.week,
      dayIndex,
      dateLabel: formatDate(date),
      note: trimmed,
      didPractice: day.didPractice,
    });
  }

  dailyEntries.sort((a, b) => b.dayNumber - a.dayNumber);

  // Weekly reflections: weeks with reflection or explicit flags, newest first
  const weeklyEntries = [];
  for (let weekNumber = 1; weekNumber <= TOTAL_WEEKS; weekNumber++) {
    const weekState = weekProgress[weekNumber];
    if (!weekState) continue;

    const hasReflection = weekState.reflectionNote.trim().length > 0;
    const hasFlags =
      weekState.completed || weekState.enjoyed || weekState.bookmarked;

    if (!hasReflection && !hasFlags) continue;

    weeklyEntries.push({
      weekNumber,
      completed: weekState.completed,
      enjoyed: weekState.enjoyed,
      bookmarked: weekState.bookmarked,
      reflection: weekState.reflectionNote.trim(),
    });
  }

  weeklyEntries.sort((a, b) => b.weekNumber - a.weekNumber);

  const hasAnyJournal = dailyEntries.length > 0 || weeklyEntries.length > 0;

  if (authLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Progress"
          subtitle="See how many days you&apos;ve practiced and which weeks you&apos;ve completed."
        />
        <GlassCard>
          <p className="text-sm text-[hsl(var(--muted))]">
            Loading your journey…
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress"
        subtitle="Track your journey through stats, notes, and reflections across all 52 weeks."
      />

      {hasAnyData && (
        <div className="flex justify-end">
          <ShareButton
            content={formatProgressForSharing({ stats, settings })}
            title="My Daily Sutra Journey"
            variant="primary"
          />
        </div>
      )}

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <div className="grid gap-4 sm:grid-cols-4">
            <StatBlock
              label="Days practiced"
              value={stats.daysPracticed.toString()}
              helper={`Out of ${TOTAL_DAYS} total days`}
            />

            <StatBlock
              label="Completion"
              value={completionPercentLabel}
              helper="Practice check-ins across the whole journey"
            />

            <StatBlock
              label="Weeks completed"
              value={stats.completedWeeks.toString()}
              helper={`Out of ${TOTAL_WEEKS} weeks`}
            />

            <StatBlock
              label="Bookmarked weeks"
              value={stats.bookmarkedWeeks.toString()}
              helper="Weeks you'd like to revisit"
            />
          </div>
        </div>
      </GlassCard>

      {!hasAnyData && !hasAnyJournal && (
        <GlassCard>
          <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
            <p className="text-sm text-[hsl(var(--muted))]">
              You haven&apos;t recorded any practice yet. Once you start checking off
              days and writing notes on the day pages, your progress will appear
              here.
            </p>
          </div>
        </GlassCard>
      )}

      {dailyEntries.length > 0 && (
        <section aria-labelledby="daily-notes-heading">
          <GlassCard>
            <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
              <h2 id="daily-notes-heading" className="text-sm font-medium text-[hsl(var(--text))]">
                Daily notes
              </h2>
            <p className="mt-1 text-xs text-[hsl(var(--muted))]">
              Days where you wrote something about your practice or how the theme
              showed up in life. Newest first.
            </p>

            <div className="mt-4 space-y-3">
              {dailyEntries.map((entry) => {
                const weekData = getWeekForDay(entry.dayNumber);
                return (
                  <div
                    key={entry.dayNumber}
                    className="group rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-3 transition-colors hover:border-[hsla(var(--border),0.7)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/day/${entry.dayNumber}`}
                        className="flex-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium">
                              Week {entry.weekNumber} · Day {entry.dayIndex}
                            </span>
                            {entry.dateLabel && (
                              <span className="text-[11px] text-[hsl(var(--muted))]">
                                {entry.dateLabel}
                              </span>
                            )}
                          </div>
                          {entry.didPractice && (
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-200">
                              Practiced
                            </span>
                          )}
                        </div>
                        <p className="mt-2 line-clamp-3 text-sm text-[hsl(var(--muted))]">
                          {entry.note}
                        </p>
                      </Link>
                      <ShareButton
                        content={formatDailyNoteForSharing({
                          weekNumber: entry.weekNumber,
                          weekTheme: weekData?.theme || "",
                          dayIndex: entry.dayIndex,
                          dateLabel: entry.dateLabel,
                          note: entry.note,
                          didPractice: entry.didPractice,
                        })}
                        title={`Week ${entry.weekNumber} - Day ${entry.dayIndex}`}
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
        </section>
      )}

      {weeklyEntries.length > 0 && (
        <section aria-labelledby="weekly-reflections-heading">
          <GlassCard>
            <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
              <h2 id="weekly-reflections-heading" className="text-sm font-medium text-[hsl(var(--text))]">
                Weekly reflections
              </h2>
            <p className="mt-1 text-xs text-[hsl(var(--muted))]">
              Notes and flags you&apos;ve added on the last day of each week.
            </p>

            <div className="mt-4 space-y-3">
              {weeklyEntries.map((week) => {
                const tags: string[] = [];
                if (week.completed) tags.push("Completed");
                if (week.enjoyed) tags.push("Enjoyed");
                if (week.bookmarked) tags.push("Bookmarked");

                const firstDayOfWeek = (week.weekNumber - 1) * 7 + 1;
                const weekData = getWeekForDay(firstDayOfWeek);

                return (
                  <div
                    key={week.weekNumber}
                    className="group rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-3 transition-colors hover:border-[hsla(var(--border),0.7)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/day/${firstDayOfWeek}`}
                        className="flex-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium">
                            Week {week.weekNumber}
                          </span>
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-[hsl(var(--muted))]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {week.reflection && (
                          <p className="mt-2 line-clamp-3 text-sm text-[hsl(var(--muted))]">
                            {week.reflection}
                          </p>
                        )}
                      </Link>
                      {week.reflection && (
                        <ShareButton
                          content={formatWeeklyReflectionForSharing({
                            weekNumber: week.weekNumber,
                            weekTheme: weekData?.theme || "",
                            reflection: week.reflection,
                            completed: week.completed,
                            enjoyed: week.enjoyed,
                            bookmarked: week.bookmarked,
                          })}
                          title={`Week ${week.weekNumber} Reflection`}
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
        </section>
      )}

      {bookmarkedWeekNumbers.length > 0 && (
        <section aria-labelledby="bookmarked-weeks-heading">
        <GlassCard>
          <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 id="bookmarked-weeks-heading" className="text-sm font-medium text-[hsl(var(--text))]">
                  Bookmarked weeks
                </h2>
                <p className="mt-1 text-xs text-[hsl(var(--muted))]">
                  Weeks you&apos;ve marked as worth revisiting when the 52-week cycle
                  is complete.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
            {bookmarkedWeekNumbers.map((weekNumber) => {
              const firstDayOfWeek = (weekNumber - 1) * 7 + 1;
              const week = getWeekForDay(firstDayOfWeek) ?? {
                week: weekNumber,
                theme: "Week theme",
              };

              return (
                <Link
                  key={weekNumber}
                  href={`/day/${firstDayOfWeek}`}
                  className="flex items-center gap-2 rounded-full border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-1.5 text-xs text-[hsl(var(--muted))] hover:border-[hsla(var(--border),0.7)]"
                >
                  <span className="font-medium">Week {weekNumber}</span>
                  <span className="truncate text-[10px] max-w-[10rem]">{week.theme}</span>
                </Link>
              );
            })}
            </div>
          </div>
        </GlassCard>
        </section>
      )}
    </div>
  );
}

interface StatBlockProps {
  label: string;
  value: string;
  helper?: string;
}

function StatBlock({ label, value, helper }: StatBlockProps) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-[hsl(var(--text))]">
        {value}
      </p>
      {helper && (
        <p className="mt-1 text-[10px] text-[hsl(var(--muted))]">{helper}</p>
      )}
    </div>
  );
}


