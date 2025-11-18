import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal"
        subtitle="A timeline of your daily notes and weekly reflections."
      />

      <GlassCard>
        <p className="text-sm text-[hsl(var(--muted))]">
          We&apos;ll add a timeline view of your notes and reflections here once
          the tracking logic is in place.
        </p>
      </GlassCard>
    </div>
  );
}

