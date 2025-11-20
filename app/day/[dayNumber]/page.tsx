import { notFound } from "next/navigation";
import { PageHeader } from "../../../components/page-header";
import { GlassCard } from "../../../components/glass-card";
import { TOTAL_DAYS } from "../../../data/yogaProgram";

interface DayPageProps {
  params: {
    dayNumber: string;
  };
}

export default function DayPage({ params }: DayPageProps) {
  const day = Number(params.dayNumber);

  if (!Number.isFinite(day) || day < 1 || day > TOTAL_DAYS) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Day ${day}`}
        subtitle="We&apos;ll soon show the week theme, core Sūtras, and practice details for each day."
      />

      <GlassCard>
        <p className="text-sm text-[hsl(var(--muted))]">
          This is a placeholder for the detailed day view. In a later step,
          we&apos;ll connect this to the 52-week program, daily practice
          toggles, and notes.
        </p>
      </GlassCard>
    </div>
  );
}

