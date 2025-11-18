import * as React from "react";
import { cn } from "../lib/cn";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export function GlassCard({
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn("glass-card rounded-2xl p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

