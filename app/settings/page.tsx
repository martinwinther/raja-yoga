"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";
import {
  useProgress,
  ProgressState,
  PROGRESS_STORAGE_KEY,
} from "../../context/progress-context";
import { useSubscription } from "../../context/subscription-context";
import { useAuth } from "../../context/auth-context";
import { createLogger } from "../../lib/logger";

const logger = createLogger("Settings");

export default function SettingsPage() {
  const { settings, dispatch } = useProgress();
  const {
    status,
    isTrialActive,
    isActivePaid,
    isExpired,
  } = useSubscription();
  const { user, authLoading, changeEmail, changePassword, sendPasswordReset, authError } = useAuth();
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  
  // Email change state
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [emailChangeError, setEmailChangeError] = useState<string | null>(null);
  const [emailChangeSuccess, setEmailChangeSuccess] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  
  // Password change state
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Password reset state
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Update reset email when user loads
  useEffect(() => {
    if (user?.email && !resetEmail) {
      setResetEmail(user.email);
    }
  }, [user?.email, resetEmail]);

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
      link.download = `dailysutra-progress-${stamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.warn("Failed to export progress", error, { action: "exportProgress" });
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
            "File does not look like a Daily Sutra progress backup."
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
        logger.warn("Failed to import progress", error, { action: "importProgress" });
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

  const handleUpgradeClick = async () => {
    if (!user || !user.email) {
      setUpgradeError("You need to be signed in with an email to upgrade.");
      return;
    }

    setUpgradeLoading(true);
    setUpgradeError(null);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to start checkout.");
      }

      const data = (await res.json()) as { url?: string };
      if (!data.url) {
        throw new Error("No checkout URL returned.");
      }

      window.location.href = data.url;
    } catch (error: any) {
      logger.warn("Upgrade error", error, { action: "createCheckoutSession", userId: user?.uid });
      setUpgradeError(
        error?.message || "Something went wrong when starting checkout."
      );
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleEmailChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newEmail || !emailPassword) {
      setEmailChangeError("Please fill in all fields");
      return;
    }

    setEmailChangeLoading(true);
    setEmailChangeError(null);
    setEmailChangeSuccess(false);

    try {
      await changeEmail(newEmail, emailPassword);
      setEmailChangeSuccess(true);
      setNewEmail("");
      setEmailPassword("");
    } catch (error) {
      // Error is handled in auth context
      setEmailChangeError(authError || "Failed to change email");
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordChangeError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordChangeError("Password must be at least 6 characters");
      return;
    }

    setPasswordChangeLoading(true);
    setPasswordChangeError(null);
    setPasswordChangeSuccess(false);

    try {
      await changePassword(newPassword, currentPassword);
      setPasswordChangeSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      // Error is handled in auth context
      setPasswordChangeError(authError || "Failed to change password");
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resetEmail) {
      setPasswordResetError("Please enter your email address");
      return;
    }

    setPasswordResetLoading(true);
    setPasswordResetError(null);
    setPasswordResetSuccess(false);

    try {
      await sendPasswordReset(resetEmail);
      setPasswordResetSuccess(true);
      setResetEmail("");
    } catch (error) {
      // Error is handled in auth context
      setPasswordResetError(authError || "Failed to send password reset email");
    } finally {
      setPasswordResetLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Adjust your start date, or reset your journey if you want to begin again."
      />

      <div className="flex items-center justify-between px-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Start date
        </h2>
      </div>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
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

      <div className="flex items-center justify-between px-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Reset journey
        </h2>
      </div>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
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

      <div className="flex items-center justify-between px-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Subscription
        </h2>
      </div>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
            Your free trial includes the first 4 weeks of content. Upgrade to
            access all 52 weeks of the program.
          </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-white/5 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-[hsl(var(--muted))]">
              Status
            </p>
            <p className="mt-1 text-sm font-semibold text-[hsl(var(--text))]">
              {isActivePaid && "Pro (paid)"}
              {isTrialActive && "Free trial"}
              {isExpired && "Upgrade required"}
              {!isActivePaid && !isTrialActive && !isExpired && "Free"}
            </p>
            {isTrialActive && (
              <p className="mt-1 text-xs text-[hsl(var(--muted))]">
                Access to weeks 1-4 (28 days)
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 text-[10px] text-[hsl(var(--muted))]">
            <p>
              With a free trial, you can access and edit content for the first 4
              weeks. Weeks 5-52 require a paid subscription.
            </p>
            <p>
              Upgrade to unlock full access to all 52 weeks of content.
            </p>
            {user?.email && (
              <p className="mt-2 text-xs text-[hsl(var(--muted))]">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={handleUpgradeClick}
            disabled={upgradeLoading || authLoading || isActivePaid}
          >
            {isActivePaid
              ? "You're on Pro"
              : upgradeLoading
              ? "Starting checkout…"
              : "Upgrade to full access"}
          </button>
          {upgradeError && (
            <p className="text-[10px] text-red-300">{upgradeError}</p>
          )}
          {!isActivePaid && !upgradeError && (
            <span className="text-[10px] text-[hsl(var(--muted))]">
              You&apos;ll be redirected to a secure Stripe checkout page.
            </span>
          )}
        </div>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between px-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Account management
        </h2>
      </div>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
            Change your account email address. You&apos;ll need to verify the new email address and re-enter your current password.
          </p>
          <form onSubmit={handleEmailChange} className="mt-4 space-y-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[hsl(var(--muted))]">
                New email address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={user?.email || "your@email.com"}
                className="rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7"
                disabled={emailChangeLoading || authLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[hsl(var(--muted))]">
                Current password
              </label>
              <input
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                placeholder="Enter your current password"
                className="rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7"
                disabled={emailChangeLoading || authLoading}
              />
            </div>
            {emailChangeError && (
              <p className="text-xs text-red-300">{emailChangeError}</p>
            )}
            {emailChangeSuccess && (
              <p className="text-xs text-green-300">
                Email changed successfully. Please check your new email for verification.
              </p>
            )}
            <button
              type="submit"
              className="btn-primary"
              disabled={emailChangeLoading || authLoading || !newEmail || !emailPassword}
            >
              {emailChangeLoading ? "Changing email…" : "Change email"}
            </button>
          </form>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
            Change your account password. You&apos;ll need to enter your current password to confirm the change.
          </p>
          <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[hsl(var(--muted))]">
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7"
                disabled={passwordChangeLoading || authLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[hsl(var(--muted))]">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7"
                disabled={passwordChangeLoading || authLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[hsl(var(--muted))]">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7"
                disabled={passwordChangeLoading || authLoading}
              />
            </div>
            {passwordChangeError && (
              <p className="text-xs text-red-300">{passwordChangeError}</p>
            )}
            {passwordChangeSuccess && (
              <p className="text-xs text-green-300">
                Password changed successfully.
              </p>
            )}
            <button
              type="submit"
              className="btn-primary"
              disabled={passwordChangeLoading || authLoading || !currentPassword || !newPassword || !confirmPassword}
            >
              {passwordChangeLoading ? "Changing password…" : "Change password"}
            </button>
          </form>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
            Forgot your password? Enter your email address and we&apos;ll send you a link to reset it.
          </p>
          <form onSubmit={handlePasswordReset} className="mt-4 space-y-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[hsl(var(--muted))]">
                Email address
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your@email.com"
                className="rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7"
                disabled={passwordResetLoading || authLoading}
              />
            </div>
            {passwordResetError && (
              <p className="text-xs text-red-300">{passwordResetError}</p>
            )}
            {passwordResetSuccess && (
              <p className="text-xs text-green-300">
                Password reset email sent. Please check your inbox and follow the instructions.
              </p>
            )}
            <button
              type="submit"
              className="btn-primary"
              disabled={passwordResetLoading || authLoading || !resetEmail}
            >
              {passwordResetLoading ? "Sending…" : "Send password reset email"}
            </button>
          </form>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between px-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Backup &amp; restore
        </h2>
      </div>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
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
        </div>
      </GlassCard>
    </div>
  );
}

