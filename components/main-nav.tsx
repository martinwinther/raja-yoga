"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/progress", label: "Progress" },
  { href: "/journal", label: "Journal" },
  { href: "/settings", label: "Settings" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden gap-4 text-sm text-[hsl(var(--muted))] sm:flex">
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
    </nav>
  );
}

