import type { PatternDoc } from './types';

/** The Delica code of one cell. Throws a RangeError when the doc has no such cell or colour. */
export function beadCode(doc: PatternDoc, row: number, col: number): string {
  const index = doc.cells[row]?.[col];
  const code = index === undefined ? undefined : doc.palette[index];
  if (code === undefined) {
    throw new RangeError(`No colour at row ${row}, column ${col}`);
  }
  return code;
}
