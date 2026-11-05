import { createRng, pick } from '@dloizides/game-rng';

import { generateMotif, MOTIF_FAMILIES, MOTIF_KINDS } from './motif';
import { MOTIF_PARAM_LIMITS } from './motifParams';
import { MotifKind } from './MotifKind';
import { MotifSymmetry } from './MotifSymmetry';
import { Stitch } from './Stitch';
import type { MotifConfig } from './types';
import { validatePatternDoc } from './validate';

const config: MotifConfig = {
  stitch: Stitch.Peyote,
  width: 16,
  height: 24,
  seed: 9,
  kind: MotifKind.Checks,
  colourCount: 3,
};

const rows = (cells: readonly (readonly number[])[]): string[] => cells.map((row) => row.join(''));
const changesInRow = (row: readonly number[]): number =>
  row.filter((value, index) => index > 0 && value !== row[index - 1]).length;

describe('generateMotif params', () => {
  it('with the shape list, has 18 shapes in four families, each in exactly one family', () => {
    const grouped = Object.values(MOTIF_FAMILIES).flat();

    const sorted = [...grouped].sort();

    expect(MOTIF_KINDS).toHaveLength(18);
    expect(Object.keys(MOTIF_FAMILIES)).toHaveLength(4);
    expect(sorted).toEqual([...MOTIF_KINDS].sort());
  });

  it.each(MOTIF_KINDS)('with kind %s, returns a valid doc using more than one colour', (kind) => {
    const doc = generateMotif({ ...config, kind, width: 12, height: 20, seed: 42 });

    expect(validatePatternDoc(doc).issues).toEqual([]);
    expect(new Set(doc.cells.flat()).size).toBeGreaterThan(1);
  });

  it('with mirror symmetry, every row reads the same both ways', () => {
    const doc = generateMotif({ ...config, kind: MotifKind.Twist, params: { symmetry: MotifSymmetry.Mirror } });

    expect(rows(doc.cells).every((row) => row === [...row].reverse().join(''))).toBe(true);
  });

  it('with quad symmetry, the chart reads the same upside down', () => {
    const doc = generateMotif({ ...config, kind: MotifKind.Twist, params: { symmetry: MotifSymmetry.Quad } });

    expect(rows(doc.cells)).toEqual(rows(doc.cells).reverse());
  });

  it('with repeat 2 on an even width, the right half repeats the left', () => {
    const doc = generateMotif({ ...config, kind: MotifKind.Hearts, params: { repeat: 2 } });

    expect(doc.cells.every((row) => row.slice(0, 8).join() === row.slice(8).join())).toBe(true);
  });

  it('with density 4, draws more colour changes per row than density 1', () => {
    const loose = generateMotif({ ...config, period: 4, params: { density: 1 } });

    const dense = generateMotif({ ...config, period: 4, params: { density: 4 } });

    expect(changesInRow(dense.cells[0] ?? [])).toBeGreaterThan(changesInRow(loose.cells[0] ?? []));
  });

  it('with a layer, returns a chart different from the base shape', () => {
    const base = generateMotif(config);

    const layered = generateMotif({ ...config, params: { layers: [MotifKind.Diamond] } });

    expect(rows(layered.cells)).not.toEqual(rows(base.cells));
  });

  it('with noise, changes some cells and stays deterministic', () => {
    const base = generateMotif(config);

    const noisy = generateMotif({ ...config, params: { noise: 0.3 } });

    expect(rows(noisy.cells)).not.toEqual(rows(base.cells));
    expect(generateMotif({ ...config, params: { noise: 0.3 } })).toEqual(noisy);
  });

  it('with 300 random parameter sets, renders every chart valid', () => {
    const rng = createRng(5);
    const limits = MOTIF_PARAM_LIMITS;
    const draw = (min: number, max: number): number => min + rng() * (max - min);
    const docs = Array.from({ length: 300 }, () => ({
      ...config,
      width: 1 + Math.floor(rng() * 40),
      height: 1 + Math.floor(rng() * 60),
      kind: pick(rng, MOTIF_KINDS),
      colourCount: pick(rng, [2, 3, 4] as const),
      params: {
        symmetry: pick(rng, limits.symmetries),
        repeat: Math.round(draw(limits.repeat.min, limits.repeat.max)),
        density: draw(limits.density.min, limits.density.max),
        layers: Array.from({ length: Math.floor(rng() * (limits.maxLayers + 1)) }, () => pick(rng, MOTIF_KINDS)),
        noise: draw(limits.noise.min, limits.noise.max),
      },
    }));

    const issues = docs.flatMap((doc) => validatePatternDoc(generateMotif(doc)).issues);

    expect(issues).toEqual([]);
  });

  it.each([
    [{ repeat: 0 }],
    [{ repeat: 1.5 }],
    [{ density: 0.1 }],
    [{ density: 9 }],
    [{ noise: -0.1 }],
    [{ noise: 2 }],
    [{ layers: [MotifKind.Diamond, MotifKind.Checks, MotifKind.Stars] }],
  ])('with the out-of-range params %j, throws a RangeError', (bad) => {
    const call = (): unknown => generateMotif({ ...config, params: bad });

    expect(call).toThrow(RangeError);
  });
});
