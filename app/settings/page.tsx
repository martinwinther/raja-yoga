"use client";

import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";
import {
  useProgress,
  ProgressState,
  PROGRESS_STORAGE_KEY,
} from "../../context/progress-context";
import { useSubscription } from "../../context/subscription-context";

export default function SettingsPage() {
  const { settings, dispatch } = useProgress();
  const {
    status,
    daysLeft,
    trialEndsAt,
    isTrialActive,
    isActivePaid,
    isExpired,
  } = useSubscription();

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

  const handleExport = () => {
    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      let exportState: ProgressState | null = null;

      if (raw) {
        const parsed = JSON.parse(raw) as ProgressState | null;
        if (parsed && typeof parsed === "object") {
          exportState = parsed;
        }
      }

      // If nothing in storage yet, still export a minimal empty state
      if (!exportState) {
        exportState = {
          dayProgress: {},
          weekProgress: {},
          settings,
        };
      }

      const blob = new Blob([JSON.stringify(exportState, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `raja-yoga-progress-${stamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("[Settings] Failed to export progress:", error);
      window.alert("Sorry, something went wrong while exporting your data.");
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        if (typeof text !== "string") {
          throw new Error("Unexpected file content");
        }

        const parsed = JSON.parse(text) as ProgressState;

        // Basic structural sanity check
        if (
          !parsed ||
          typeof parsed !== "object" ||
          !("dayProgress" in parsed) ||
          !("weekProgress" in parsed) ||
          !("settings" in parsed)
        ) {
          throw new Error(
            "File does not look like a Raja Yoga progress backup."
          );
        }

        const confirmed = window.confirm(
          "Importing will replace your current progress with the data from this file. Continue?"
        );
        if (!confirmed) return;

        dispatch({ type: "HYDRATE_FROM_STORAGE", payload: parsed });

        // localStorage persistence effect in ProgressProvider will run automatically
        window.alert("Import completed. Your journey state has been updated.");
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("[Settings] Failed to import progress:", error);
        window.alert(
          "Sorry, this file could not be imported. Make sure it is an unmodified backup from this app."
        );
      } finally {
        // reset file input so the same file can be selected again if needed
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Adjust your start date, or reset your journey if you want to begin again."
      />

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--text))]">
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
                className="rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7"
              />
            </label>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--text))]">
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
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Subscription
        </h2>
        <p className="mt-1 text-sm text-[hsl(var(--muted))]">
          This journey starts with a free month so you can see if the 52-week
          structure fits your life.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-white/5 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-[hsl(var(--muted))]">
              Status
            </p>
            <p className="mt-1 text-sm font-semibold text-[hsl(var(--text))]">
              {isActivePaid && "Pro (paid)"}
              {isTrialActive && "Free trial"}
              {isExpired && "Trial ended"}
              {!isActivePaid && !isTrialActive && !isExpired && "Free"}
            </p>
            {isTrialActive && daysLeft !== null && (
              <p className="mt-1 text-xs text-[hsl(var(--muted))]">
                About {daysLeft} day{daysLeft === 1 ? "" : "s"} left in your
                trial.
              </p>
            )}
            {trialEndsAt && (
              <p className="mt-1 text-[10px] text-[hsl(var(--muted))]">
                Trial ends:{" "}
                {trialEndsAt.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 text-[10px] text-[hsl(var(--muted))]">
            <p>
              When the trial ends, you&apos;ll still be able to read your notes
              and see your journey, but new edits will be locked.
            </p>
            <p>
              In a future version, this is where you&apos;ll be able to upgrade
              to the full paid experience.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn-primary opacity-70 cursor-not-allowed"
            disabled
          >
            Upgrade (coming soon)
          </button>
          <span className="text-[10px] text-[hsl(var(--muted))]">
            Payments are not enabled yet.
          </span>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Backup &amp; restore
        </h2>
        <p className="mt-2 text-sm text-[hsl(var(--muted))]">
          You can export your current journey to a JSON file and later import it
          on this or another device. This is useful if you uninstall the app,
          switch browsers, or want a manual backup.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={handleExport} className="btn-primary">
            Export progress as JSON
          </button>
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-[hsl(var(--muted))]">
            <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] font-medium">
              Import backup
            </span>
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
        <p className="mt-2 text-[10px] text-[hsl(var(--muted))]">
          Imported files completely replace your current progress. Only use
          backups that were exported from this app.
        </p>
      </GlassCard>
    </div>
  );
}

