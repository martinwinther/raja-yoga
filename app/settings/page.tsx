"use client";

import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";
import { useProgress } from "../../context/progress-context";

export default function SettingsPage() {
  const { settings, dispatch } = useProgress();

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || null;
    dispatch({ type: "SET_START_DATE", date: value });
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "This will clear all progress and notes. Are you sure you want to reset your journey?"
    );
    if (!confirmed) return;

    dispatch({ type: "RESET_ALL" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Adjust your start date, or reset your journey if you want to begin again."
      />

      <GlassCard>
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Start date
        </h2>
        <p className="mt-2 text-sm text-[hsl(var(--muted))]">
          The start date determines which week and day you are on today. You
          can change it if you want to restart or sync the journey to a
          different calendar date.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex flex-col text-sm text-[hsl(var(--muted))]">
            <span className="mb-1">Journey start date</span>
            <input
              type="date"
              value={settings.startDate ?? ""}
              onChange={handleDateChange}
              className="rounded-xl border border-[hsla(var(--border),0.7)] bg-black/20 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))]"
            />
          </label>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Reset journey
        </h2>
        <p className="mt-2 text-sm text-[hsl(var(--muted))]">
          This will clear all recorded practice check-ins and notes, and remove
          your start date. You can&apos;t undo this action.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-4 btn-primary"
        >
          Reset all progress
        </button>
      </GlassCard>
    </div>
  );
}

