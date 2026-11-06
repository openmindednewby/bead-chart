import { geometry } from './geometry';
import { Stitch } from './Stitch';

const HOLE_LENGTH = 13;
const DIAMETER = 16;
const HALF = 0.5;

function pitch(stitch: Stitch): readonly [number, number] {
  return stitch === Stitch.Brick ? [DIAMETER, HOLE_LENGTH] : [HOLE_LENGTH, DIAMETER];
}

/** Rows a square figure needs at this width so it stays square on the bead pitch. */
export function figureChartHeight(stitch: Stitch, width: number): number {
  const [pitchX, pitchY] = pitch(stitch);
  return Math.floor((width * pitchX) / pitchY + HALF);
}

/** Samples a square bitmap on the real bead centres of the stitch; row 0 is the bottom row. */
export function sampleFigure(pixels: Uint8Array, size: number, stitch: Stitch, width: number): number[][] {
  const height = figureChartHeight(stitch, width);
  const layout = geometry({ version: 1, stitch, width, height, palette: [], cells: [] });
  const cells = Array.from({ length: height }, () => new Array<number>(width).fill(0));
  for (const bead of layout.positions) {
    const sx = Math.min(size - 1, Math.floor(((bead.x + HALF) / layout.extentX) * size));
    const sy = Math.min(size - 1, Math.max(0, Math.floor((1 - (bead.y + HALF) / layout.extentY) * size)));
    const row = cells[bead.row];
    if (row !== undefined) {
      row[bead.col] = pixels[sy * size + sx] ?? 0;
    }
  }
  return cells;
}
