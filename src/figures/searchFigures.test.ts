import { loadFigure, loadFigureIndex, searchFigures } from './index';
import type { FigureEntry } from './figureTypes';

const ENTRIES: readonly FigureEntry[] = [
  { id: 'a', name: 'fox', keywords: ['fox', 'face'], category: 'Animals & Nature', family: 'NotoEmoji', chunk: 0 },
  { id: 'b', name: 'foxglove', keywords: ['flower'], category: 'Animals & Nature', family: 'NotoEmoji', chunk: 0 },
  { id: 'c', name: 'red heart', keywords: ['heart', 'love'], category: 'Smileys & Emotion', family: 'NotoEmoji', chunk: 0 },
];

describe('searchFigures', () => {
  it('with an exact name, ranks that figure before prefix matches', () => {
    const query = 'fox';

    const found = searchFigures(ENTRIES, query);

    expect(found.map((entry) => entry.id)).toEqual(['a', 'b']);
  });

  it('with two words, keeps only figures matching both', () => {
    const query = 'heart lo';

    const found = searchFigures(ENTRIES, query);

    expect(found.map((entry) => entry.id)).toEqual(['c']);
  });

  it('with a limit, returns at most that many figures', () => {
    const query = '';

    const found = searchFigures(ENTRIES, query, 2);

    expect(found).toHaveLength(2);
  });

  it('with the real catalogue, finds the fox emoji for "fox"', async () => {
    const index = await loadFigureIndex();

    const found = searchFigures(index, 'fox');

    expect(found[0]?.id).toBe('e1f98a');
  });

  it('with an id not in its chunk, resolves to undefined', async () => {
    const entry = { ...ENTRIES[0], id: 'missing' };

    const source = await loadFigure(entry);

    expect(source).toBeUndefined();
  });
});
