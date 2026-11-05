import golden from './__golden__/motifs.json';
import { generateMotif } from './motif';
import { MotifSymmetry } from './MotifSymmetry';
import type { MotifConfig } from './types';

interface GoldenMotif {
  readonly config: MotifConfig;
  readonly palette: readonly string[];
  readonly cells: string;
}

const cases = (golden as unknown as GoldenMotif[]).map((entry) => [entry.config.kind, entry] as const);
const flat = (cells: readonly (readonly number[])[]): string => cells.map((row) => row.join('')).join('/');

describe('generateMotif golden', () => {
  it.each(cases)('with the v0.2.0 %s config, returns the v0.2.0 chart', (_kind, entry) => {
    const doc = generateMotif(entry.config);

    expect({ palette: doc.palette, cells: flat(doc.cells) }).toEqual({ palette: entry.palette, cells: entry.cells });
  });

  it.each(cases)('with %s and default params, returns the v0.2.0 chart', (_kind, entry) => {
    const params = { symmetry: MotifSymmetry.None, repeat: 1, density: 1, layers: [], noise: 0 };

    const doc = generateMotif({ ...entry.config, params });

    expect(flat(doc.cells)).toBe(entry.cells);
  });
});
