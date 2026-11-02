import doc from './__golden__/peyote-5x4.doc.json';
import { beadCounts, shoppingList } from './counts';
import { geometry } from './geometry';
import { recolour, recolourToPalette } from './recolour';
import type { PatternDoc } from './types';

const pattern = doc as PatternDoc;

describe('recolour', () => {
  it('with a new mapping, keeps the geometry', () => {
    const result = recolour(pattern, { DB0001: 'DB0010' });

    expect(geometry(result)).toEqual(geometry(pattern));
  });

  it('with one colour mapped, moves its count to the new code', () => {
    const result = recolour(pattern, { DB0001: 'DB0010' });

    expect(beadCounts(result)).toEqual({
      total: 20,
      lines: [
        { code: 'DB0010', count: 9 },
        { code: 'DB0002', count: 6 },
        { code: 'DB0003', count: 5 },
      ],
    });
  });

  it('with two colours mapped to one code, merges their counts', () => {
    const result = recolour(pattern, { DB0002: 'DB0003' });

    expect(beadCounts(result).lines).toEqual([
      { code: 'DB0003', count: 11 },
      { code: 'DB0001', count: 9 },
    ]);
  });

  it('with a new mapping, the shopping list follows', () => {
    const result = recolour(pattern, { DB0001: 'DB0010' });

    expect(shoppingList(result).map((line) => line.code)).toEqual(['DB0010', 'DB0002', 'DB0003']);
  });

  it('with an unknown target code, throws', () => {
    const call = (): unknown => recolour(pattern, { DB0001: '<script>' });

    expect(call).toThrow('Unknown Delica code');
  });

  it('with a mapping, leaves the source doc unchanged', () => {
    const before = JSON.stringify(pattern);

    recolour(pattern, { DB0001: 'DB0010' });

    expect(JSON.stringify(pattern)).toBe(before);
  });
});

describe('recolourToPalette', () => {
  it('with a palette of the same codes, returns the same counts', () => {
    const result = recolourToPalette(pattern, ['DB0003', 'DB0002', 'DB0001']);

    expect(beadCounts(result)).toEqual(beadCounts(pattern));
  });

  it('with a one-colour palette, puts every bead on that code', () => {
    const result = recolourToPalette(pattern, ['DB0010']);

    expect(beadCounts(result).lines).toEqual([{ code: 'DB0010', count: 20 }]);
  });

  it('with an empty palette, throws', () => {
    const call = (): unknown => recolourToPalette(pattern, []);

    expect(call).toThrow(RangeError);
  });
});
