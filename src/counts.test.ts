import doc from './__golden__/peyote-5x4.doc.json';
import { beadCounts, shoppingList } from './counts';
import type { PatternDoc } from './types';

const pattern = doc as PatternDoc;

describe('beadCounts', () => {
  it('with the 5x4 doc, returns the hand-counted lines', () => {
    const counts = beadCounts(pattern);

    expect(counts).toEqual({
      total: 20,
      lines: [
        { code: 'DB0001', count: 9 },
        { code: 'DB0002', count: 6 },
        { code: 'DB0003', count: 5 },
      ],
    });
  });

  it('with an unused palette entry, leaves it out', () => {
    const counts = beadCounts({ ...pattern, palette: [...pattern.palette, 'DB0010'] });

    expect(counts.lines).toHaveLength(3);
  });

  it('with a tied count, orders by code', () => {
    const counts = beadCounts({
      ...pattern,
      width: 2,
      height: 1,
      palette: ['DB0002', 'DB0001'],
      cells: [[0, 1]],
    });

    expect(counts.lines.map((line) => line.code)).toEqual(['DB0001', 'DB0002']);
  });
});

describe('shoppingList', () => {
  it('with a discontinued bead, adds the name and the flag to its line', () => {
    const list = shoppingList({ ...pattern, width: 1, height: 1, palette: ['DB0551'], cells: [[0]] });

    expect(list).toEqual([
      { code: 'DB0551', name: 'Silver Plated Silver', hex: '#B5B0A7', count: 1, discontinued: true },
    ]);
  });

  it('with an unknown code, throws', () => {
    const call = (): unknown =>
      shoppingList({ ...pattern, width: 1, height: 1, palette: ['DB9999'], cells: [[0]] });

    expect(call).toThrow('Unknown Delica code');
  });
});
