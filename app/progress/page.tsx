import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress"
        subtitle="See how many days and weeks you&apos;ve practiced, and revisit your favorite weeks."
      />

      <GlassCard>
        <p className="text-sm text-[hsl(var(--muted))]">
          We&apos;ll add progress stats and bookmarked weeks here once the
          tracking logic is in place.
        </p>
      </GlassCard>
    </div>
  );
}

