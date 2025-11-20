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
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
            We&apos;ll add progress stats and bookmarked weeks here once the
            tracking logic is in place.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

