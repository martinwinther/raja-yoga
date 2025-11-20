"use client";

import Link from "next/link";
import { PageHeader } from "../components/page-header";
import { GlassCard } from "../components/glass-card";
import { useAuth } from "../context/auth-context";
import { useProgress } from "../context/progress-context";
import {
  TOTAL_WEEKS,
  TOTAL_DAYS,
  YOGA_PROGRAM,
  getYogaWeek,
} from "../data/yogaProgram";
import { getCurrentWeekAndDay } from "../lib/progress-time";
import { WeekGrid } from "../components/week-grid";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { settings } = useProgress();
  const firstWeek = YOGA_PROGRAM[0];
  const current = getCurrentWeekAndDay(settings);
  const currentWeekData = current ? getYogaWeek(current.week) : null;
  const hasStartDate = Boolean(settings.startDate);

  if (authLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="52 Weeks of Raja Yoga"
          subtitle="Loading your journey…"
        />
        <GlassCard>
          <p className="text-sm text-[hsl(var(--muted))]">
            Please wait while we check your account.
          </p>
        </GlassCard>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="52 Weeks of Raja Yoga"
          subtitle="A guided year-long journey through the Yoga Sūtras, with one small practice each day."
        />
        <GlassCard>
          <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
            <h2 className="text-sm font-medium text-[hsl(var(--text))]">
              Start your free month
            </h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted))]">
              Create a free account to begin a 1-month trial. You&apos;ll get a clear
              weekly theme, a daily micro-practice, and space to track notes and
              reflections as you move through the 52 weeks.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/auth" className="btn-primary">
                Create account
              </Link>
              <Link href="/auth" className="btn-ghost text-xs">
                Already have an account? Log in
              </Link>
            </div>
            <p className="mt-3 text-[10px] text-[hsl(var(--muted))]">
              No spam. Your email is used only to save your progress and manage your
              subscription status.
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Raja Yoga Journey"
        subtitle="A calm, structured 52-week program based on Patañjali&apos;s Yoga Sūtras. One weekly theme, tiny daily actions, and space to reflect."
      />

      {hasStartDate ? (
        current && firstWeek ? (
          <GlassCard>
            <div className="-mx-6 rounded-lg bg-white/7 px-6 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
              <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--text))]">
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
            </div>
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
            <div className="-mx-6 rounded-lg bg-white/7 px-6 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
              <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--text))]">
                Today&apos;s position
              </h2>
              <p className="mt-2 text-sm text-[hsl(var(--muted))]">
                Your start date is set, but today falls outside the 52-week range
                (1–{TOTAL_DAYS} days). You can adjust your start date in Settings
                if needed.
              </p>
            </div>
          </GlassCard>
        )
      ) : (
        <GlassCard>
          <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
            <p className="mb-3 text-xs text-[hsl(var(--muted))]">
              Set your journey start date to anchor which week and day you&apos;re
              on. You can back-date it if you already started.
            </p>
            <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--text))]">
              Choose a start date
            </h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted))]">
              Set a start date to let the app track which week and day you&apos;re
              on. You can start today, or pick any date you want to treat as Day 1.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href="/settings" className="btn-primary">
                Set start date in Settings
              </Link>
              <p className="text-xs text-[hsl(var(--muted))]">
                You can always change this later.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--text))]">
            Program overview
          </h2>
          <p className="mt-2 text-sm text-[hsl(var(--muted))]">
            This journey is organized into {TOTAL_WEEKS} weeks and {TOTAL_DAYS} days.
            Each week has a theme, core Sūtra references, a key idea, and a simple practice
            protocol you can experiment with in daily life.
          </p>
        </div>
        {firstWeek ? (
          <div className="-mx-6 mt-4 rounded-xl bg-white/8 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
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

