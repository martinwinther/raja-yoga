import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Adjust your start date, reset your journey, and export data."
      />

      <GlassCard>
        <p className="text-sm text-[hsl(var(--muted))]">
          We&apos;ll add start date adjustment, reset options, and data export
          here once the tracking logic is in place.
        </p>
      </GlassCard>
    </div>
  );
}

