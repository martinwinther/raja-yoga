import { PageHeader } from "../components/page-header";
import { GlassCard } from "../components/glass-card";
import {
  TOTAL_WEEKS,
  TOTAL_DAYS,
  YOGA_PROGRAM,
} from "../data/yogaProgram";

export default function HomePage() {
  const firstWeek = YOGA_PROGRAM[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Raja Yoga Journey"
        subtitle="A calm, structured 52-week program based on Patañjali&apos;s Yoga Sūtras. One weekly theme, tiny daily actions, and space to reflect."
      />

      <GlassCard>
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Overview
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

      <GlassCard>
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Next steps
        </h2>
        <p className="mt-2 text-sm text-[hsl(var(--muted))]">
          In upcoming steps we&apos;ll add your start date, a weekly journey grid,
          daily practice check-ins, and weekly reviews with bookmarks.
        </p>
      </GlassCard>
    </div>
  );
}

