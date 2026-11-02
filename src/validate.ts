import { findDelica } from './delica';
import { PatternDocIssue } from './PatternDocIssue';
import { Stitch } from './Stitch';
import type { PatternDoc, PatternDocValidation } from './types';

export const MAX_CHART_SIDE = 400;

const STITCHES: readonly unknown[] = [Stitch.Peyote, Stitch.Brick, Stitch.Loom];

function isSide(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= MAX_CHART_SIDE;
}

function paletteIssues(palette: unknown): PatternDocIssue[] {
  if (!Array.isArray(palette) || palette.length === 0) {
    return [PatternDocIssue.BadPalette];
  }
  const issues: PatternDocIssue[] = [];
  if (new Set(palette).size !== palette.length) {
    issues.push(PatternDocIssue.BadPalette);
  }
  if (palette.some((code) => typeof code !== 'string' || findDelica(code) === undefined)) {
    issues.push(PatternDocIssue.UnknownCode);
  }
  return issues;
}

function isCellRow(row: unknown, width: unknown, colours: number): boolean {
  return (
    Array.isArray(row) &&
    row.length === width &&
    row.every((cell) => Number.isInteger(cell) && cell >= 0 && cell < colours)
  );
}

function cellIssues(doc: Readonly<Record<string, unknown>>): PatternDocIssue[] {
  const { cells, height, width, palette } = doc;
  const colours = Array.isArray(palette) ? palette.length : 0;
  const valid =
    Array.isArray(cells) &&
    cells.length === height &&
    cells.every((row) => isCellRow(row, width, colours));
  return valid ? [] : [PatternDocIssue.BadCells];
}

/** Checks untrusted JSON against the PatternDoc shape and the Delica list. */
export function validatePatternDoc(value: unknown): PatternDocValidation {
  if (typeof value !== 'object' || value === null) {
    return { ok: false, issues: [PatternDocIssue.NotAnObject] };
  }
  const doc = value as Readonly<Record<string, unknown>>;
  const issues: PatternDocIssue[] = [
    ...(doc.version === 1 ? [] : [PatternDocIssue.UnsupportedVersion]),
    ...(STITCHES.includes(doc.stitch) ? [] : [PatternDocIssue.UnknownStitch]),
    ...(isSide(doc.width) && isSide(doc.height) ? [] : [PatternDocIssue.BadSize]),
    ...paletteIssues(doc.palette),
    ...cellIssues(doc),
  ];
  return { ok: issues.length === 0, issues };
}

/** Returns the value as a PatternDoc, or throws an Error naming every issue. */
export function assertPatternDoc(value: unknown): PatternDoc {
  const { ok, issues } = validatePatternDoc(value);
  if (!ok) {
    throw new Error(`Invalid PatternDoc: ${issues.join(', ')}`);
  }
  return value as PatternDoc;
}
