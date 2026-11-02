import golden from './__golden__/stitch-order.json';
import { Stitch } from './Stitch';
import { stitchOrder, threadPath } from './stitchOrder';
import { solidDoc } from './testDocs.test-helper';

function rowCol(stitch: Stitch, width: number, height: number): number[][] {
  return stitchOrder(solidDoc(stitch, width, height)).map((bead) => [bead.row, bead.col]);
}

describe('stitchOrder', () => {
  it('with even-width peyote, follows the hand-worked order', () => {
    const order = rowCol(Stitch.Peyote, 4, 3);

    expect(order).toEqual(golden.peyoteEven4x3);
  });

  it('with odd-width peyote, follows the hand-worked order', () => {
    const order = rowCol(Stitch.Peyote, 5, 2);

    expect(order).toEqual(golden.peyoteOdd5x2);
  });

  it('with brick, turns at the end of every row', () => {
    const order = rowCol(Stitch.Brick, 2, 3);

    expect(order).toEqual(golden.brick2x3);
  });

  it('with loom, reads every row from the left', () => {
    const order = rowCol(Stitch.Loom, 2, 3);

    expect(order).toEqual(golden.loom2x3);
  });

  it('with 20 beads, numbers them from 0 without a gap', () => {
    const order = stitchOrder(solidDoc(Stitch.Peyote, 5, 4));

    expect(order.map((bead) => bead.seq)).toEqual(Array.from({ length: 20 }, (_, index) => index));
  });
});

describe('threadPath', () => {
  it.each([[4], [5], [6], [7]])(
    'with peyote width %i, a bead after the first pass sits in a gap of the row below',
    (width) => {
      const rows = threadPath(solidDoc(Stitch.Peyote, width, 3));
      const beads = rows.flatMap((row) => row.beads);
      const has = (x: number, y: number): boolean => beads.some((b) => b.x === x && b.y === y);
      const added = rows.slice(1).flatMap((row) => row.beads);

      const unsupported = added.filter((b) => !(has(b.x - 1, b.y - 0.5) || has(b.x + 1, b.y - 0.5)));

      expect(unsupported).toEqual([]);
    },
  );

  it.each([[4], [5], [6], [7]])('with peyote width %i, a row turn moves one column', (width) => {
    const rows = threadPath(solidDoc(Stitch.Peyote, width, 4));

    const turns = rows.slice(1, -1).map((row, index) => {
      const next = rows[index + 2];
      return Math.abs((next?.beads[0]?.col ?? 0) - (row.beads[row.beads.length - 1]?.col ?? 0));
    });

    expect(turns.every((turn) => turn === 1)).toBe(true);
  });

  it('with odd-width peyote, rows alternate three and two beads', () => {
    const rows = threadPath(solidDoc(Stitch.Peyote, 5, 2));

    expect(rows.map((row) => row.beads.length)).toEqual([5, 3, 2]);
  });

  it('with even-width peyote, every later row has half the width', () => {
    const rows = threadPath(solidDoc(Stitch.Peyote, 6, 2));

    expect(rows.map((row) => row.beads.length)).toEqual([6, 3, 3]);
  });

  it('with a one-wide peyote doc, skips the empty even rows', () => {
    const rows = threadPath(solidDoc(Stitch.Peyote, 1, 2));

    expect(rows.map((row) => row.rows)).toEqual([[1, 2], [3]]);
  });
});
