import doc from './__golden__/peyote-5x4.doc.json';
import golden from './__golden__/peyote-5x4.wordchart.json';
import { Stitch } from './Stitch';
import { solidDoc } from './testDocs.test-helper';
import type { PatternDoc } from './types';
import { wordChart } from './wordChart';

describe('wordChart', () => {
  it('with the hand-worked 5x4 peyote doc, equals the golden file', () => {
    const chart = wordChart(doc as PatternDoc);

    expect(chart).toEqual(golden);
  });

  it('with peyote, the first entry counts as rows 1 and 2', () => {
    const chart = wordChart(doc as PatternDoc);

    expect(chart[0]?.rows).toEqual([1, 2]);
  });

  it('with a 5x4 peyote doc, the entries add up to every bead', () => {
    const chart = wordChart(doc as PatternDoc);

    expect(chart.reduce((sum, row) => sum + row.beads, 0)).toBe(20);
  });

  it('with a solid loom row, merges the row into one run', () => {
    const chart = wordChart(solidDoc(Stitch.Loom, 4, 1));

    expect(chart).toEqual([
      { rows: [1], direction: 'ltr', beads: 4, runs: [{ code: 'DB0001', count: 4 }] },
    ]);
  });
});
