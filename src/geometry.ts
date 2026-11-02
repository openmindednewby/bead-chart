import { Stitch } from './Stitch';
import type { BeadPosition, ChartGeometry, PatternDoc } from './types';

const HALF_BEAD = 0.5;

function isLiftedPeyoteColumn(width: number, col: number): boolean {
  return col % 2 !== (width - 1) % 2;
}

function offsetX(stitch: Stitch, row: number): number {
  return stitch === Stitch.Brick && row % 2 === 1 ? HALF_BEAD : 0;
}

function offsetY(stitch: Stitch, width: number, col: number): number {
  return stitch === Stitch.Peyote && isLiftedPeyoteColumn(width, col) ? HALF_BEAD : 0;
}

/** Where one bead sits, in bead units, with the first worked row at y 0 and y growing upward. */
export function beadPosition(doc: PatternDoc, row: number, col: number): BeadPosition {
  return {
    row,
    col,
    x: col + offsetX(doc.stitch, row),
    y: row + offsetY(doc.stitch, doc.width, col),
  };
}

/** Every bead position in row order, plus the size of the whole chart in bead units. */
export function geometry(doc: PatternDoc): ChartGeometry {
  const rows = Array.from({ length: doc.height }, (_, row) => row);
  const cols = Array.from({ length: doc.width }, (_, col) => col);
  const positions = rows.flatMap((row) => cols.map((col) => beadPosition(doc, row, col)));
  return {
    positions,
    extentX: doc.width + (doc.stitch === Stitch.Brick && doc.height > 1 ? HALF_BEAD : 0),
    extentY: doc.height + (doc.stitch === Stitch.Peyote && doc.width > 1 ? HALF_BEAD : 0),
  };
}
