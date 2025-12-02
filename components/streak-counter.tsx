"use client";

import { Flame } from "lucide-react";
import { useProgress } from "../context/progress-context";
import { useAuth } from "../context/auth-context";
import { calculateStreak } from "../lib/progress-stats";
import { cn } from "../lib/cn";

export function StreakCounter() {
  const { dayProgress, settings } = useProgress();
  const { user } = useAuth();

  // Only show streak for authenticated users
  if (!user) {
    return null;
  }

  const streak = calculateStreak({
    dayProgress,
    settings,
  });

  // Don't show if no streak and no start date
  if (streak.count === 0 && !settings.startDate) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors",
        "text-sm font-medium",
        streak.isActive
          ? "text-[hsl(var(--accent))]"
          : "text-[hsl(var(--muted))]"
      )}
      aria-label={`Practice streak: ${streak.count} day${streak.count !== 1 ? "s" : ""}`}
    >
      <Flame
        className={cn(
          "h-4 w-4 transition-colors",
          streak.isActive ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--muted))]"
        )}
        strokeWidth={streak.isActive ? 2.5 : 2}
        fill={streak.isActive ? "currentColor" : "none"}
      />
      <span>{streak.count}</span>
    </div>
  );
}



