import { requireDelica } from './delica';
import type { BeadCounts, PatternDoc, ShoppingLine, WordRun } from './types';

function byCountThenCode(a: WordRun, b: WordRun): number {
  if (a.count !== b.count) {
    return b.count - a.count;
  }
  return a.code < b.code ? -1 : 1;
}

/** Beads per colour, most used first. Palette entries with no bead are left out. */
export function beadCounts(doc: PatternDoc): BeadCounts {
  const tally = new Map<number, number>();
  for (const index of doc.cells.flat()) {
    tally.set(index, (tally.get(index) ?? 0) + 1);
  }
  const lines = doc.palette
    .map((code, index) => ({ code, count: tally.get(index) ?? 0 }))
    .filter((line) => line.count > 0)
    .sort(byCountThenCode);
  return { total: lines.reduce((sum, line) => sum + line.count, 0), lines };
}

/** The bead counts with each colour's name, hex and discontinued flag. */
export function shoppingList(doc: PatternDoc): ShoppingLine[] {
  return beadCounts(doc).lines.map((line) => {
    const { name, hex, discontinued } = requireDelica(line.code);
    return { ...line, name, hex, discontinued };
  });
}
