import type { FigureEntry } from './figureTypes';

const DEFAULT_LIMIT = 60;
const EXACT = 0;
const NAME_WORD = 1;
const OTHER = 2;

function words(entry: FigureEntry): string[] {
  return [...entry.name.split(' '), ...entry.keywords, ...entry.category.toLowerCase().split(/\W+/)];
}

function rank(entry: FigureEntry, query: string): number {
  if (entry.name === query) {
    return EXACT;
  }
  return entry.name.split(' ').includes(query) ? NAME_WORD : OTHER;
}

/** Figures whose name, keywords or category start with every word of the query, best match first. */
export function searchFigures(index: readonly FigureEntry[], query: string, limit: number = DEFAULT_LIMIT): FigureEntry[] {
  const needle = query.trim().toLowerCase();
  const terms = needle.split(/\s+/).filter((term) => term !== '');
  const matches = index.filter((entry) => {
    const haystack = words(entry);
    return terms.every((term) => haystack.some((word) => word.startsWith(term)));
  });
  return matches
    .map((entry, order) => ({ entry, order, score: rank(entry, needle) }))
    .sort((a, b) => a.score - b.score || a.order - b.order)
    .slice(0, limit)
    .map(({ entry }) => entry);
}
