import { PageHeader } from "../components/page-header";
import { GlassCard } from "../components/glass-card";

export default function HomePage() {
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
          You&apos;ll move through 52 weekly themes covering the nature of mind,
          yama and niyama, body and breath, and meditation. Each day you&apos;ll
          mark whether you practiced and capture a short note.
        </p>
        <p className="mt-3 text-sm text-[hsl(var(--muted))]">
          We&apos;ll add your week-by-week journey grid here in a later step.
        </p>
      </GlassCard>

      <GlassCard>
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Next steps
        </h2>
        <p className="mt-2 text-sm text-[hsl(var(--muted))]">
          For now, you can explore the placeholder pages via the navigation
          above. In upcoming steps we&apos;ll add your start date, progress
          tracking, daily notes, and weekly reviews.
        </p>
      </GlassCard>
    </div>
  );
}

