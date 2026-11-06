import { encodeFigureBitmap, FIGURE_SOURCE_SIZE } from './figureBitmap';
import { FIGURE_MIN_WIDTH, figureToChart } from './figureChart';
import { figureChartHeight } from './figureSample';
import { FigureTones } from './FigureTones';
import { Stitch } from './Stitch';
import { validatePatternDoc } from './validate';

function squareSource(palette: readonly string[] = []): { id: string; size: number; pixels: string; palette: readonly string[] } {
  const size = FIGURE_SOURCE_SIZE;
  const pixels = Array.from({ length: size * size }, (_, at) => {
    const x = at % size;
    const y = Math.floor(at / size);
    const inside = x >= 8 && x < 40 && y >= 8 && y < 40;
    if (!inside) {
      return 0;
    }
    return palette.length > 1 && x >= 24 ? 2 : 1;
  });
  return { id: 'square', size, pixels: encodeFigureBitmap(pixels), palette };
}

describe('figureToChart', () => {
  it('with a width under 40, clamps the chart to 40 beads wide', () => {
    const source = squareSource();

    const doc = figureToChart(source, { stitch: Stitch.Peyote, width: 20 });

    expect(doc.width).toBe(FIGURE_MIN_WIDTH);
  });

  it('with no width, renders at the 40-bead minimum', () => {
    const source = squareSource();

    const doc = figureToChart(source, { stitch: Stitch.Loom });

    expect(doc.width).toBe(40);
  });

  it('with a one-colour glyph, shades it in three tones on a background', () => {
    const source = squareSource();

    const doc = figureToChart(source, { stitch: Stitch.Loom, width: 40 });

    const used = new Set(doc.cells.flat());
    expect(doc.palette).toHaveLength(4);
    expect([...used].sort()).toEqual([0, 1, 2, 3]);
  });

  it('with the key light top-left, lights the top edge and darkens the bottom edge', () => {
    const source = squareSource();

    const doc = figureToChart(source, { stitch: Stitch.Loom, width: 40 });

    const filledRows = doc.cells.map((row, index) => ({ row, index })).filter(({ row }) => row.some((cell) => cell > 0));
    const top = filledRows[filledRows.length - 1];
    const bottom = filledRows[0];
    expect(top.row.filter((cell) => cell > 0).every((cell) => cell === 2)).toBe(true);
    expect(bottom.row.slice(12, 28).every((cell) => cell === 3)).toBe(true);
  });

  it('with two tones, drops the light tone', () => {
    const source = squareSource();

    const doc = figureToChart(source, { stitch: Stitch.Brick, width: 40, tones: FigureTones.Two });

    expect(doc.palette).toHaveLength(3);
    expect(validatePatternDoc(doc).ok).toBe(true);
  });

  it('with a colour figure whose colours share a Delica bead, merges them into one palette entry', () => {
    const source = squareSource(['#ff0000', '#fe0101']);

    const doc = figureToChart(source, { stitch: Stitch.Peyote, width: 40 });

    expect(doc.palette).toHaveLength(2);
    expect(validatePatternDoc(doc).ok).toBe(true);
  });

  it('with each stitch, keeps a square figure square on the bead pitch', () => {
    const stitches = [Stitch.Peyote, Stitch.Brick, Stitch.Loom];

    const heights = stitches.map((stitch) => figureChartHeight(stitch, 40));

    expect(heights).toEqual([33, 49, 33]);
  });
});
