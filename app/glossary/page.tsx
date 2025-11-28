"use client";

import { useEffect, useState, useMemo } from "react";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";
import { GlossaryTermCard } from "../../components/glossary-term";
import { getAllGlossaryTerms } from "../../lib/firebase/glossary";
import type { GlossaryTerm } from "../../types/glossary";
import { createLogger } from "../../lib/logger";

const logger = createLogger("Glossary");

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchTerms() {
      try {
        setLoading(true);
        const fetchedTerms = await getAllGlossaryTerms();
        setTerms(fetchedTerms);
        setError(null);
      } catch (err) {
        logger.error("Failed to fetch glossary terms", err, { action: "fetchGlossaryTerms" });
        setError("Failed to load glossary terms");
      } finally {
        setLoading(false);
      }
    }

    fetchTerms();
  }, []);

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) {
      return terms;
    }

    const query = searchQuery.toLowerCase();
    return terms.filter(
      (term) =>
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
    );
  }, [terms, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Glossary"
        subtitle="Key Sanskrit and technical terms used in the Yoga Sūtras teachings and commentary. Click on any term to expand its definition."
      />

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm">
          <label htmlFor="glossary-search" className="sr-only">
            Search glossary terms
          </label>
          <input
            id="glossary-search"
            type="text"
            placeholder="Search terms or definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-white/5 px-4 py-2 text-sm text-[hsl(var(--text))] placeholder:text-[hsl(var(--muted))] border border-[hsla(var(--border),0.4)] backdrop-blur-sm focus:border-[hsl(var(--accent))] focus:bg-white/7 focus:outline-none transition-all duration-200"
          />
        </div>
      </GlassCard>

      {loading ? (
        <div className="text-sm text-[hsl(var(--muted))]">Loading glossary...</div>
      ) : error ? (
        <div className="text-sm text-[hsl(var(--muted))]">{error}</div>
      ) : filteredTerms.length === 0 ? (
        <div className="text-sm text-[hsl(var(--muted))]">
          {searchQuery ? "No terms found matching your search." : "No glossary terms found."}
        </div>
      ) : (
        <>
          {searchQuery && (
            <div className="text-sm text-[hsl(var(--muted))]">
              Found {filteredTerms.length} term{filteredTerms.length === 1 ? "" : "s"}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          )}
          <div className="space-y-2">
            {filteredTerms.map((term) => (
              <GlossaryTermCard
                key={term.id}
                term={term.term}
                definition={term.definition}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


