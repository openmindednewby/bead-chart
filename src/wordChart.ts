import { threadPath } from './stitchOrder';
import type { PatternDoc, WordRow, WordRun } from './types';

function mergeRuns(codes: readonly string[]): WordRun[] {
  const runs: WordRun[] = [];
  for (const code of codes) {
    const last = runs[runs.length - 1];
    if (last?.code === code) {
      runs[runs.length - 1] = { code, count: last.count + 1 };
    } else {
      runs.push({ code, count: 1 });
    }
  }
  return runs;
}

/** The written instructions: per woven row, its direction and the colour runs in thread order. */
export function wordChart(doc: PatternDoc): WordRow[] {
  return threadPath(doc).map((row) => ({
    rows: row.rows,
    direction: row.direction,
    beads: row.beads.length,
    runs: mergeRuns(row.beads.map((bead) => bead.code)),
  }));
}
