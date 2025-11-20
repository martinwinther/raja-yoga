import Link from "next/link";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About 52 Weeks of Raja Yoga"
        subtitle="A year-long, realistic exploration of the Yoga Sūtras of Patañjali."
      />

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <h2 className="text-sm font-medium text-[hsl(var(--text))]">
            What this is
          </h2>
          <p className="mt-2 text-sm text-[hsl(var(--muted))]">
            52 Weeks of Raja Yoga is a structured journey through the Yoga Sūtras.
            Each week you focus on one theme from Patañjali&apos;s text, with a small
            daily practice and space to reflect on how it shows up in real life.
          </p>

          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted))]">
            How it works
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-[hsl(var(--muted))]">
            <li>• 52 weeks, each linked to specific sūtras and a clear key idea.</li>
            <li>• Each day, you mark whether you practiced and optionally write a note.</li>
            <li>• At the end of each week you can review, bookmark, and reflect.</li>
            <li>• Progress syncs across devices via your account.</li>
          </ul>

          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted))]">
            Free month and beyond
          </h3>
          <p className="mt-2 text-sm text-[hsl(var(--muted))]">
            When you sign up, you get a 1-month free trial to explore the structure
            and see if it serves you. After the trial, you can still read your notes
            and see your journey, but marking new practice and editing notes is
            locked until you upgrade in a future version.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              Go to Home
            </Link>
            <Link href="/auth" className="btn-ghost text-xs">
              Create account / Sign in
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

