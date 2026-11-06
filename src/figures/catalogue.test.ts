import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { figureToChart } from '../figureChart';
import { Stitch } from '../Stitch';
import { validatePatternDoc } from '../validate';
import { FIGURE_FAMILIES, figureLicence, FIGURE_LICENCES, loadFigure, loadFigureIndex } from './index';
import type { FigureEntry, FigureSource } from './figureTypes';

const ROOT = join(__dirname, '..', '..');
const STITCHES = [Stitch.Peyote, Stitch.Brick, Stitch.Loom];

async function loadAll(entries: readonly FigureEntry[]): Promise<FigureSource[]> {
  const sources = await Promise.all(entries.map((entry) => loadFigure(entry)));
  return sources.filter((source): source is FigureSource => source !== undefined);
}

describe('figure catalogue', () => {
  it('with the generated index, holds over 10,000 figures from fonts and emoji', async () => {
    const minimum = 10000;

    const index = await loadFigureIndex();

    expect(index.length).toBeGreaterThanOrEqual(minimum);
    expect(index.some((entry) => entry.family === 'NotoEmoji')).toBe(true);
    expect(new Set(index.map((entry) => entry.family)).size).toBeGreaterThan(10);
  });

  it('with every figure at 40 wide, renders a valid chart in each stitch and no two charts match', async () => {
    const index = await loadFigureIndex();

    const sources = await loadAll(index);

    const keys = new Set<string>();
    const invalid: string[] = [];
    for (const source of sources) {
      const docs = STITCHES.map((stitch) => figureToChart(source, { stitch, width: 40 }));
      if (docs.some((doc) => !validatePatternDoc(doc).ok)) {
        invalid.push(source.id);
      }
      keys.add(docs.map((doc) => `${doc.palette.join(',')}:${doc.cells.map((row) => row.join('')).join('/')}`).join('|'));
    }
    expect(sources).toHaveLength(index.length);
    expect(invalid).toEqual([]);
    expect(keys.size).toBe(sources.length);
  }, 300000);

  it('with every source family, records a licence whose text ships in LICENSES and NOTICE', () => {
    const notice = readFileSync(join(ROOT, 'NOTICE'), 'utf8');

    const licences = FIGURE_FAMILIES.map(([family]) => figureLicence(family));

    expect(licences.every((licence) => ['OFL-1.1', 'Apache-2.0', 'Unicode-3.0'].includes(licence.licence))).toBe(true);
    expect(FIGURE_LICENCES.every((licence) => existsSync(join(ROOT, licence.licenceFile)))).toBe(true);
    expect(FIGURE_LICENCES.every((licence) => notice.includes(licence.attribution))).toBe(true);
  });

  it('with the generated index, ships no meme figure', async () => {
    const meme = /meme/i;

    const index = await loadFigureIndex();

    expect(index.filter((entry) => meme.test(entry.category) || meme.test(entry.family))).toEqual([]);
  });
});
