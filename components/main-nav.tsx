"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/cn";
import { useAuth } from "../context/auth-context";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sutras", label: "Sutras" },
  { href: "/glossary", label: "Glossary" },
  { href: "/progress", label: "Progress" },
  { href: "/journal", label: "Journal" },
  { href: "/settings", label: "Settings" },
];

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

