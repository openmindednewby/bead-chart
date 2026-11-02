import { requireDelica } from './delica';
import { Stitch } from './Stitch';
import { renderChartSvg } from './svg';
import { solidDoc } from './testDocs.test-helper';

const FILL = 'fill="#2D2E37"';

function rectYs(svg: string): number[] {
  return [...svg.matchAll(/<rect x="[\d.]+" y="([\d.]+)"/g)].map((match) => Number(match[1]));
}

describe('renderChartSvg', () => {
  it('with a 2x1 loom doc, returns the exact string', () => {
    const svg = renderChartSvg(solidDoc(Stitch.Loom, 2, 1));

    expect(svg).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 16" role="img">' +
        '<g stroke="currentColor" stroke-opacity="0.2">' +
        `<rect x="0" y="0" width="12" height="15" rx="3" ${FILL}/>` +
        `<rect x="13" y="0" width="12" height="15" rx="3" ${FILL}/>` +
        '</g></svg>',
    );
  });

  it('with firstRow bottom and a 2x1 peyote doc, puts the lifted column 0 above column 1', () => {
    const svg = renderChartSvg(solidDoc(Stitch.Peyote, 2, 1), { firstRow: 'bottom' });

    expect(svg).toContain(`<rect x="0" y="0" width="12" height="15" rx="3" ${FILL}/>`);
    expect(svg).toContain(`<rect x="13" y="8" width="12" height="15" rx="3" ${FILL}/>`);
  });

  it('with no option and a 2x1 peyote doc, puts row 1 on the top edge and row 2 half a bead down', () => {
    const svg = renderChartSvg(solidDoc(Stitch.Peyote, 2, 1));

    expect(svg).toContain(`<rect x="13" y="0" width="12" height="15" rx="3" ${FILL}/>`);
    expect(svg).toContain(`<rect x="0" y="8" width="12" height="15" rx="3" ${FILL}/>`);
  });

  it('with a two-colour 1x2 loom doc and no option, draws the first worked row at y 0', () => {
    const first = 'DB0001';
    const second = 'DB0002';
    const doc = { ...solidDoc(Stitch.Loom, 1, 2), palette: [first, second], cells: [[0], [1]] };

    const svg = renderChartSvg(doc);

    expect(svg).toContain(`y="0" width="12" height="15" rx="3" fill="${requireDelica(first).hex}"`);
    expect(svg).toContain(`y="16" width="12" height="15" rx="3" fill="${requireDelica(second).hex}"`);
  });

  it('with a two-colour 1x2 loom doc and firstRow bottom, draws the first worked row at y 16', () => {
    const first = 'DB0001';
    const second = 'DB0002';
    const doc = { ...solidDoc(Stitch.Loom, 1, 2), palette: [first, second], cells: [[0], [1]] };

    const svg = renderChartSvg(doc, { firstRow: 'bottom' });

    expect(svg).toContain(`y="16" width="12" height="15" rx="3" fill="${requireDelica(first).hex}"`);
    expect(svg).toContain(`y="0" width="12" height="15" rx="3" fill="${requireDelica(second).hex}"`);
  });

  it('with a 4x2 peyote doc and firstRow top, woven rows 1 to 4 run down the chart', () => {
    const svg = renderChartSvg(solidDoc(Stitch.Peyote, 4, 2), { firstRow: 'top' });

    expect(rectYs(svg)).toEqual([8, 0, 8, 0, 16, 16, 24, 24]);
  });

  it('with a 4x2 peyote doc and firstRow bottom, woven rows 1 to 4 run up the chart', () => {
    const svg = renderChartSvg(solidDoc(Stitch.Peyote, 4, 2), { firstRow: 'bottom' });

    expect(rectYs(svg)).toEqual([16, 24, 16, 24, 8, 8, 0, 0]);
  });

  it('with a 4x2 peyote doc, keeps the same viewBox for either firstRow', () => {
    const doc = solidDoc(Stitch.Peyote, 4, 2);

    const top = renderChartSvg(doc, { firstRow: 'top' });
    const bottom = renderChartSvg(doc, { firstRow: 'bottom' });

    expect(top).toContain('viewBox="0 0 52 40"');
    expect(bottom).toContain('viewBox="0 0 52 40"');
  });

  it('with brick, swaps the bead pitch', () => {
    const svg = renderChartSvg(solidDoc(Stitch.Brick, 1, 2));

    expect(svg).toContain('viewBox="0 0 24 26"');
  });

  it('with brick, draws the beads in stitch order', () => {
    const svg = renderChartSvg(solidDoc(Stitch.Brick, 2, 2));

    const xs = [...svg.matchAll(/<rect x="(\d+)"/g)].map((match) => Number(match[1]));

    expect(xs).toEqual([0, 16, 24, 8]);
  });

  it('with a label, escapes it into aria-label', () => {
    const svg = renderChartSvg(solidDoc(Stitch.Loom, 1, 1), { label: '"><script>&' });

    expect(svg).toContain('aria-label="&quot;&gt;&lt;script&gt;&amp;"');
  });

  it('with a code outside the Delica list, throws before any markup', () => {
    const doc = { ...solidDoc(Stitch.Loom, 1, 1), palette: ['"><script>'] };

    const call = (): unknown => renderChartSvg(doc);

    expect(call).toThrow('Invalid PatternDoc');
  });
});
