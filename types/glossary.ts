export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  sortKey: string; // For alphabetical sorting (lowercase, normalized)
}

