import { findDelica } from './delica';
import { generateMotif, MOTIF_KINDS } from './motif';
import { MotifKind } from './MotifKind';
import { Stitch } from './Stitch';
import type { MotifConfig } from './types';
import { validatePatternDoc } from './validate';

const config: MotifConfig = {
  stitch: Stitch.Peyote,
  width: 12,
  height: 20,
  seed: 42,
  kind: MotifKind.Diamond,
  colourCount: 3,
};

describe('generateMotif', () => {
  it('with the same config and seed, returns identical docs', () => {
    const first = generateMotif(config);

    const second = generateMotif(config);

    expect(second).toEqual(first);
  });

  it.each(MOTIF_KINDS)('with kind %s, returns a valid doc using more than one colour', (kind) => {
    const doc = generateMotif({ ...config, kind });

    expect(validatePatternDoc(doc).issues).toEqual([]);
    expect(new Set(doc.cells.flat()).size).toBeGreaterThan(1);
  });

  it.each([11, 42, 77, 1234, 99991])('with seed %i, every colour is a current Delica bead', (seed) => {
    const doc = generateMotif({ ...config, seed, colourCount: 4 });

    const colours = doc.palette.map((code) => findDelica(code));

    expect(colours.every((colour) => colour !== undefined && !colour.discontinued)).toBe(true);
  });

  it('with colourCount 4, returns four different codes', () => {
    const doc = generateMotif({ ...config, colourCount: 4 });

    expect(new Set(doc.palette).size).toBe(4);
  });

  it('with different seeds, returns different docs', () => {
    const first = generateMotif(config);

    const second = generateMotif({ ...config, seed: 43 });

    expect(second).not.toEqual(first);
  });

  it('with a base colour, starts the palette at the nearest bead', () => {
    const doc = generateMotif({ ...config, baseColour: '#2D2E37' });

    expect(doc.palette[0]).toBe('DB0001');
  });

  it('with an explicit period, widens the bands', () => {
    const doc = generateMotif({ ...config, kind: MotifKind.Stripes, period: 5, width: 2, height: 10 });

    expect(doc.cells[0]?.[0]).toBe(doc.cells[4]?.[0]);
    expect(doc.cells[4]?.[0]).not.toBe(doc.cells[5]?.[0]);
  });

  it('with a scatter, the left half mirrors the right', () => {
    const doc = generateMotif({ ...config, kind: MotifKind.Scatter });

    expect(doc.cells.every((row) => row.join() === [...row].reverse().join())).toBe(true);
  });

  it.each([
    [{ width: 0 }],
    [{ height: 401 }],
    [{ width: 1.5 }],
    [{ period: 0 }],
  ])('with the out-of-range %j, throws a RangeError', (bad) => {
    const call = (): unknown => generateMotif({ ...config, ...bad });

    expect(call).toThrow(RangeError);
  });
});
