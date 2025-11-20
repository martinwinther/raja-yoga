"use client";

import { PageHeader } from "../components/page-header";
import { GlassCard } from "../components/glass-card";
import { useProgress } from "../context/progress-context";
import {
  TOTAL_WEEKS,
  TOTAL_DAYS,
  YOGA_PROGRAM,
  getYogaWeek,
} from "../data/yogaProgram";
import { getCurrentWeekAndDay } from "../lib/progress-time";
import Link from "next/link";
import { WeekGrid } from "../components/week-grid";

export default function HomePage() {
  const { settings } = useProgress();
  const firstWeek = YOGA_PROGRAM[0];
  const current = getCurrentWeekAndDay(settings);
  const currentWeekData = current ? getYogaWeek(current.week) : null;
  const hasStartDate = Boolean(settings.startDate);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Raja Yoga Journey"
        subtitle="A calm, structured 52-week program based on Patañjali&apos;s Yoga Sūtras. One weekly theme, tiny daily actions, and space to reflect."
      />

      {hasStartDate ? (
        current && firstWeek ? (
          <GlassCard>
            <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
              Today&apos;s position
            </h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted))]">
              Based on your start date, you&apos;re currently on Week{" "}
              <span className="font-medium">{current.week}</span>, Day{" "}
              <span className="font-medium">{current.dayIndex}</span>.
            </p>
            <p className="mt-3 text-sm text-[hsl(var(--muted))]">
              This week&apos;s theme is{" "}
              <span className="font-medium">
                {currentWeekData ? currentWeekData.theme : `Week ${current.week}`}
              </span>
              . We&apos;ll soon show the full theme and practice details on the
              day page.
            </p>
            <div className="mt-4">
              <Link
                href={`/day/${current.globalDayNumber}`}
                className="btn-primary"
              >
                Go to today&apos;s practice
              </Link>
            </div>
          </GlassCard>
        ) : (
          <GlassCard>
            <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
              Today&apos;s position
            </h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted))]">
              Your start date is set, but today falls outside the 52-week range
              (1–{TOTAL_DAYS} days). You can adjust your start date in Settings
              if needed.
            </p>
          </GlassCard>
        )
      ) : (
        <GlassCard>
          <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
            Choose a start date
          </h2>
          <p className="mt-2 text-sm text-[hsl(var(--muted))]">
            Set a start date to let the app track which week and day you&apos;re
            on. You can start today, or pick any date you want to treat as Day 1.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link href="/settings" className="btn-primary">
              Set start date in Settings
            </Link>
            <p className="text-xs text-[hsl(var(--muted))]">
              You can always change this later.
            </p>
          </div>
        </GlassCard>
      )}

      <GlassCard>
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Program overview
        </h2>
        <p className="mt-2 text-sm text-[hsl(var(--muted))]">
          This journey is organized into {TOTAL_WEEKS} weeks and {TOTAL_DAYS} days.
          Each week has a theme, core Sūtra references, a key idea, and a simple practice
          protocol you can experiment with in daily life.
        </p>
        {firstWeek ? (
          <div className="mt-4 rounded-xl border border-[hsla(var(--border),0.7)] bg-black/10 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
              Week {firstWeek.week} preview
            </p>
            <p className="mt-1 text-sm font-semibold">{firstWeek.theme}</p>
            <p className="mt-1 text-xs text-[hsl(var(--muted))]">
              Core Sūtras: {firstWeek.coreSutras}
            </p>
            <p className="mt-2 text-sm text-[hsl(var(--muted))]">
              {firstWeek.keyIdea}
            </p>
          </div>
        ) : null}
      </GlassCard>

      <WeekGrid />
    </div>
  );
}

