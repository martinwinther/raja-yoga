import Link from "next/link";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

export default function OfflinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Offline mode"
        subtitle="You&apos;re currently offline. Some data may be out of date."
      />

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
            The shell of the app is still available, and any changes you make will
            be saved locally when possible. Once you&apos;re back online, the app
            will sync your journey with the server.
          </p>
          <p className="mt-3 text-xs text-[hsl(var(--muted))]">
            You can try navigating back to{" "}
            <Link href="/" className="underline">
              Home
            </Link>{" "}
            or other pages. If content doesn&apos;t load, please reconnect to the
            internet and refresh.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

