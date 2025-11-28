import * as React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-[hsl(var(--text))] sm:text-3xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm text-[hsl(var(--muted))]" id="page-subtitle">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

