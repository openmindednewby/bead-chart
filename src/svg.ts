import { requireDelica } from './delica';
import { geometry } from './geometry';
import { Stitch } from './Stitch';
import { stitchOrder } from './stitchOrder';
import type { ChartSvgOptions, PatternDoc } from './types';
import { assertPatternDoc } from './validate';

const BEAD_HOLE_LENGTH = 13;
const BEAD_DIAMETER = 16;
const BEAD_GAP = 1;
const BEAD_CORNER = 3;

function escapeAttribute(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** An SVG string of the chart, beads in stitch order, row 1 at the top unless firstRow is 'bottom'. */
export function renderChartSvg(value: PatternDoc, options: ChartSvgOptions = {}): string {
  const doc = assertPatternDoc(value);
  const holeUpright = doc.stitch === Stitch.Brick;
  const pitchX = holeUpright ? BEAD_DIAMETER : BEAD_HOLE_LENGTH;
  const pitchY = holeUpright ? BEAD_HOLE_LENGTH : BEAD_DIAMETER;
  const { extentX, extentY } = geometry(doc);
  const rects = stitchOrder(doc).map((bead) => {
    const y = (options.firstRow === 'bottom' ? extentY - bead.y - 1 : bead.y) * pitchY;
    const size = `width="${pitchX - BEAD_GAP}" height="${pitchY - BEAD_GAP}" rx="${BEAD_CORNER}"`;
    return `<rect x="${bead.x * pitchX}" y="${y}" ${size} fill="${requireDelica(bead.code).hex}"/>`;
  });
  const label = options.label === undefined ? '' : ` aria-label="${escapeAttribute(options.label)}"`;
  const viewBox = `0 0 ${extentX * pitchX} ${extentY * pitchY}`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img"${label}>` +
    `<g stroke="currentColor" stroke-opacity="0.2">${rects.join('')}</g></svg>`
  );
}
