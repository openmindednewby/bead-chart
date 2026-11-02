import { Stitch } from './Stitch';
import { renderChartSvg } from './svg';
import { solidDoc } from './testDocs.test-helper';

const FILL = 'fill="#2D2E37"';

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

  it('with a 2x1 peyote doc, puts the lifted column 0 above column 1', () => {
    const svg = renderChartSvg(solidDoc(Stitch.Peyote, 2, 1));

    expect(svg).toContain(`<rect x="0" y="0" width="12" height="15" rx="3" ${FILL}/>`);
    expect(svg).toContain(`<rect x="13" y="8" width="12" height="15" rx="3" ${FILL}/>`);
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
