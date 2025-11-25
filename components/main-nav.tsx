"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/cn";
import { useAuth } from "../context/auth-context";
import { useSubscription } from "../context/subscription-context";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sutras", label: "Sutras" },
  { href: "/glossary", label: "Glossary" },
  { href: "/progress", label: "Progress" },
  { href: "/journal", label: "Journal" },
  { href: "/settings", label: "Settings" },
];

function SubscriptionBadge() {
  const {
    status,
    daysLeft,
    isTrialActive,
    isActivePaid,
    isExpired,
    loading,
  } = useSubscription();

  if (loading) {
    return (
      <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-[hsl(var(--muted))] border border-[hsla(var(--border),0.4)]">
        Loading…
      </span>
    );
  }

  if (isActivePaid) {
    return (
      <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-medium text-emerald-200 border border-emerald-400/60">
        Pro
      </span>
    );
  }

  if (isTrialActive && daysLeft !== null) {
    return (
      <span className="rounded-full bg-amber-500/15 px-2 py-1 text-[10px] font-medium text-amber-100 border border-amber-400/70">
        Trial · {daysLeft} day{daysLeft === 1 ? "" : "s"} left
      </span>
    );
  }

  if (isExpired) {
    return (
      <span className="rounded-full bg-red-500/15 px-2 py-1 text-[10px] font-medium text-red-200 border border-red-400/70">
        Trial ended
      </span>
    );
  }

  // fallback (no doc / none)
  return (
    <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-[hsl(var(--muted))] border border-[hsla(var(--border),0.4)]">
      Free
    </span>
  );
}

export function MainNav() {
  const pathname = usePathname();
  const { user, signOut, authLoading } = useAuth();

  return (
    <nav className="hidden gap-4 text-sm text-[hsl(var(--muted))] sm:flex sm:items-center">
      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "transition-colors hover:text-[hsl(var(--text))]",
              isActive && "text-[hsl(var(--text))] font-medium"
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <SubscriptionBadge />
      {user && (
        <button
          type="button"
          onClick={signOut}
          className="btn-ghost text-[10px]"
          disabled={authLoading}
        >
          Sign out
        </button>
      )}
      {!user && (
        <Link href="/auth" className="btn-ghost text-[10px]">
          Sign in
        </Link>
      )}
    </nav>
  );
}

