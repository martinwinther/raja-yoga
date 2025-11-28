"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { GlassCard } from "./glass-card";
import { ShareButton } from "./share-button";
import { formatSutraForSharing } from "../lib/sharing";
import type { Sutra } from "../types/sutra";

interface SutraAccordionProps {
  sutraNumber: number;
  title: string;
  sutraText: string;
  commentary: string;
  book?: string;
}

export function SutraAccordion({
  sutraNumber,
  title,
  sutraText,
  commentary,
  book = "Book",
}: SutraAccordionProps) {
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
          aria-controls={`commentary-${sutraNumber}`}
          aria-label={`${isExpanded ? "Hide" : "Show"} commentary for ${book} ${sutraNumber}: ${title}`}
        >
          <div className="flex-1 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
                Sutra {sutraNumber}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[hsl(var(--text))]">
              {title}
            </h3>
            <div className="text-sm leading-relaxed text-[hsl(var(--text))]">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              >
                {sutraText}
              </ReactMarkdown>
            </div>
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
        id={`commentary-${sutraNumber}`}
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="mt-4 space-y-3 border-t border-[hsla(var(--border),0.3)] pt-4">
          <div className="flex items-center justify-between gap-4">
            <h4 className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
              Commentary
            </h4>
            <ShareButton
              content={formatSutraForSharing({
                book,
                sutraNumber,
                title,
                sutraText,
                commentary,
              })}
              title={`${book} ${sutraNumber}`}
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
              {commentary}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

