"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "../../../components/page-header";
import { BookNav } from "../../../components/book-nav";
import { SutraAccordion } from "../../../components/sutra-accordion";
import { getSutrasByBook } from "../../../lib/firebase/sutras";
import type { Sutra } from "../../../types/sutra";
import { createLogger } from "../../../lib/logger";

const logger = createLogger("Sutras");

interface BookPageProps {
  params: {
    book: string;
  };
}

const bookMap: Record<string, string> = {
  i: "I",
  ii: "II",
  iii: "III",
  iv: "IV",
};

export default function BookPage({ params }: BookPageProps) {
  const [sutras, setSutras] = useState<Sutra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookParam = params?.book;
  const bookValue = bookParam ? bookMap[bookParam] : null;

  useEffect(() => {
    if (!bookParam || !bookValue) {
      if (!bookValue) {
        setError("Invalid book");
      }
      setLoading(false);
      return;
    }

    async function fetchSutras() {
      // TypeScript guard: bookValue is checked above, but we need to assert it here
      if (!bookValue) return;
      
      try {
        setLoading(true);
        const fetchedSutras = await getSutrasByBook(bookValue);
        setSutras(fetchedSutras);
        setError(null);
      } catch (err) {
        logger.error("Failed to fetch sutras", err, { action: "fetchSutras", book: bookValue });
        setError("Failed to load sutras");
      } finally {
        setLoading(false);
      }
    }

    fetchSutras();
  }, [bookParam, bookValue]);

  if (!bookParam || !bookValue) {
    return notFound();
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title={`Book ${bookValue}`} />
        <div className="text-sm text-[hsl(var(--muted))]">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Book ${bookValue}`}
        subtitle="Click on any sutra to expand its commentary"
      />

      <BookNav />

      {loading ? (
        <div className="text-sm text-[hsl(var(--muted))]">Loading sutras...</div>
      ) : sutras.length === 0 ? (
        <div className="text-sm text-[hsl(var(--muted))]">
          No sutras found for this book.
        </div>
      ) : (
        <div className="space-y-4">
          {sutras.map((sutra) => (
            <SutraAccordion
              key={sutra.id}
              sutraNumber={sutra.sutraNumber}
              title={sutra.title}
              sutraText={sutra.sutraText}
              commentary={sutra.commentary}
            />
          ))}
        </div>
      )}
    </div>
  );
}

