import { generateMotif, MOTIF_FAMILIES } from './motif';
import { findMotifPreset, MOTIF_PRESETS, presetConfig } from './motifPresets';
import { Stitch } from './Stitch';
import { validatePatternDoc } from './validate';

const base = { stitch: Stitch.Peyote, width: 24, height: 30, seed: 7 };
const chartOf = (index: number): string =>
  generateMotif(presetConfig(MOTIF_PRESETS[index]!, base)).cells.map((row) => row.join('')).join('/');

describe('MOTIF_PRESETS', () => {
  it('with the shipped data, has at least 100 presets in four families', () => {
    const families = new Set(MOTIF_PRESETS.map((preset) => preset.family));

    expect(MOTIF_PRESETS.length).toBeGreaterThanOrEqual(100);
    expect(families.size).toBe(4);
  });

  it('with the shipped data, gives every preset a unique id and name', () => {
    const ids = new Set(MOTIF_PRESETS.map((preset) => preset.id));

    const names = new Set(MOTIF_PRESETS.map((preset) => preset.name));

    expect(ids.size).toBe(MOTIF_PRESETS.length);
    expect(names.size).toBe(MOTIF_PRESETS.length);
  });

  it('with the shipped data, files every preset under the family of its shape', () => {
    const misfiled = MOTIF_PRESETS.filter((preset) => !MOTIF_FAMILIES[preset.family].includes(preset.kind));

    const ids = misfiled.map((preset) => preset.id);

    expect(ids).toEqual([]);
  });

  it.each(MOTIF_PRESETS.map((preset) => [preset.id, preset] as const))(
    'with preset %s, renders a valid chart using more than one colour',
    (_id, preset) => {
      const doc = generateMotif(presetConfig(preset, base));

      expect(validatePatternDoc(doc).issues).toEqual([]);
      expect(new Set(doc.cells.flat()).size).toBeGreaterThan(1);
    },
  );

  it('with every preset rendered, returns no two identical charts', () => {
    const charts = MOTIF_PRESETS.map((_preset, index) => chartOf(index));

    const duplicates = MOTIF_PRESETS.filter((_preset, index) => charts.indexOf(charts[index] ?? '') !== index);

    expect(duplicates.map((preset) => preset.id)).toEqual([]);
  });

  it('with a known id, returns the preset; with an unknown id, returns undefined', () => {
    const first = MOTIF_PRESETS[0];

    const found = findMotifPreset(first?.id ?? '');

    expect(found).toBe(first);
    expect(findMotifPreset('no-such-preset')).toBeUndefined();
  });
});
