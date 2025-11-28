"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { GlassCard } from "./glass-card";
import { ShareButton } from "./share-button";
import { formatGlossaryTermForSharing } from "../lib/sharing";
import type { GlossaryTerm } from "../types/glossary";

interface GlossaryTermProps {
  term: string;
  definition: string;
}

export function GlossaryTermCard({ term, definition }: GlossaryTermProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <GlassCard>
      <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <button
          type="button"
          onClick={handleToggle}
          className="flex w-full items-start justify-between gap-4 text-left"
          aria-expanded={isExpanded}
          aria-controls={`definition-${term}`}
          aria-label={`${isExpanded ? "Hide" : "Show"} definition for ${term}`}
        >
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[hsl(var(--text))]">
              {term}
            </h3>
          </div>
          <div
            className={`flex-shrink-0 transition-transform duration-200 ease-out ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[hsl(var(--muted))]"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      </div>
      <div
        id={`definition-${term}`}
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="mt-4 space-y-3 border-t border-[hsla(var(--border),0.3)] pt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1" />
            <ShareButton
              content={formatGlossaryTermForSharing({
                term,
                definition,
              })}
              title={term}
              variant="ghost"
              className="flex-shrink-0"
            />
          </div>
          <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed text-[hsl(var(--text))]">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
              }}
            >
              {definition}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}






