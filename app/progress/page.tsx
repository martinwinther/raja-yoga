"use client";

import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";
import { useProgress } from "../../context/progress-context";
import { computeStats, getRecentDayHistory } from "../../lib/progress-stats";
import {
  TOTAL_DAYS,
  TOTAL_WEEKS,
  getWeekForDay,
  getDayIndexInWeek,
} from "../../data/yogaProgram";
import Link from "next/link";

export default function ProgressPage() {
  const { dayProgress, weekProgress } = useProgress();

  const stats = computeStats({ dayProgress, weekProgress });

  const recentHistory = getRecentDayHistory({ dayProgress, count: 10 });

  const completionPercentLabel = `${stats.practiceCompletionPercent.toFixed(1)}%`;

  const hasAnyData =
    stats.daysPracticed > 0 ||
    stats.totalDaysWithAnyData > 0 ||
    stats.completedWeeks > 0;

  const bookmarkedWeekNumbers = Object.keys(weekProgress)
    .map((w) => Number(w))
    .filter((w) => weekProgress[w]?.bookmarked)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress"
        subtitle="See how many days you've practiced, which weeks you've completed, and what you might want to revisit after the 52 weeks."
      />

      <GlassCard>
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
      </GlassCard>

      {!hasAnyData && (
        <GlassCard>
          <p className="text-sm text-[hsl(var(--muted))]">
            You haven't recorded any practice yet. Once you start checking off
            days and writing notes on the day pages, your progress will appear
            here.
          </p>
        </GlassCard>
      )}

      {recentHistory.length > 0 && (
        <GlassCard>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-medium text-[hsl(var(--text))]">
                Recent days
              </h2>
              <p className="mt-1 text-xs text-[hsl(var(--muted))]">
                The last few days where you've added a note or marked practice.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {recentHistory.map((item) => {
              const week = getWeekForDay(item.dayNumber);
              const dayIndex = getDayIndexInWeek(item.dayNumber);

              if (!week || !dayIndex) return null;

              const label = `W${week.week}·D${dayIndex}`;
              const practiced = item.didPractice;
              const hasNote = item.hasNote;

              return (
                <Link
                  key={item.dayNumber}
                  href={`/day/${item.dayNumber}`}
                  className={[
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                    practiced
                      ? "border-emerald-400/80 bg-emerald-500/15 text-emerald-50"
                      : "border-[hsla(var(--border),0.4)] bg-white/5 text-[hsl(var(--muted))] hover:border-[hsla(var(--border),0.7)]",
                  ].join(" ")}
                >
                  <span className="font-medium">{label}</span>
                  {hasNote && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
                      Note
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </GlassCard>
      )}

      {bookmarkedWeekNumbers.length > 0 && (
        <GlassCard>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-medium text-[hsl(var(--text))]">
                Bookmarked weeks
              </h2>
              <p className="mt-1 text-xs text-[hsl(var(--muted))]">
                Weeks you've marked as worth revisiting when the 52-week cycle
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
                  <span className="truncate text-[10px]">{week.theme}</span>
                </Link>
              );
            })}
          </div>
        </GlassCard>
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


