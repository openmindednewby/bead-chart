import { beadCode } from './docAccess';
import { beadPosition } from './geometry';
import { RowDirection } from './RowDirection';
import { Stitch } from './Stitch';
import type { PatternDoc, StitchBead, WovenRow } from './types';

interface RowSpec {
  readonly rows: readonly number[];
  readonly direction: RowDirection;
  readonly row: number;
  readonly cols: readonly number[];
}

function ascending(width: number): number[] {
  return Array.from({ length: width }, (_, col) => col);
}

function peyoteLaterRows(width: number, row: number): RowSpec[] {
  const lastParity = (width - 1) % 2;
  const down = ascending(width)
    .filter((col) => col % 2 === lastParity)
    .reverse();
  const up = ascending(width).filter((col) => col % 2 !== lastParity);
  const oddRow = 2 * row + 1;
  return [
    { rows: [oddRow], direction: RowDirection.RightToLeft, row, cols: down },
    { rows: [oddRow + 1], direction: RowDirection.LeftToRight, row, cols: up },
  ];
}

function peyoteSpecs(doc: PatternDoc): RowSpec[] {
  const first: RowSpec = {
    rows: [1, 2],
    direction: RowDirection.LeftToRight,
    row: 0,
    cols: ascending(doc.width),
  };
  const later = Array.from({ length: doc.height - 1 }, (_, index) =>
    peyoteLaterRows(doc.width, index + 1),
  ).flat();
  return [first, ...later].filter((spec) => spec.cols.length > 0);
}

function brickSpecs(doc: PatternDoc): RowSpec[] {
  return Array.from({ length: doc.height }, (_, row) => {
    const leftToRight = row % 2 === 0;
    const cols = ascending(doc.width);
    return {
      rows: [row + 1],
      direction: leftToRight ? RowDirection.LeftToRight : RowDirection.RightToLeft,
      row,
      cols: leftToRight ? cols : cols.reverse(),
    };
  });
}

function loomSpecs(doc: PatternDoc): RowSpec[] {
  return Array.from({ length: doc.height }, (_, row) => ({
    rows: [row + 1],
    direction: RowDirection.LeftToRight,
    row,
    cols: ascending(doc.width),
  }));
}

function rowSpecs(doc: PatternDoc): RowSpec[] {
  if (doc.stitch === Stitch.Peyote) {
    return peyoteSpecs(doc);
  }
  return doc.stitch === Stitch.Brick ? brickSpecs(doc) : loomSpecs(doc);
}

/** The thread path as woven rows. Peyote's first pass strings rows 1 and 2 together. */
export function threadPath(doc: PatternDoc): WovenRow[] {
  let seq = 0;
  return rowSpecs(doc).map((spec) => ({
    rows: spec.rows,
    direction: spec.direction,
    beads: spec.cols.map((col) => ({
      ...beadPosition(doc, spec.row, col),
      seq: seq++,
      code: beadCode(doc, spec.row, col),
    })),
  }));
}

/** Every bead in the order the thread reaches it. */
export function stitchOrder(doc: PatternDoc): StitchBead[] {
  return threadPath(doc).flatMap((row) => [...row.beads]);
}
