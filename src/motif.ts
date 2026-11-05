import { harmony } from '@dloizides/color-science';
import { createRng, mulberry32, pick, type Rng } from '@dloizides/game-rng';

import { availableDelica, nearestDelica } from './delica';
import { MotifFamily } from './MotifFamily';
import { MotifKind } from './MotifKind';
import { resolveMotifParams, type ResolvedMotifParams } from './motifParams';
import { MOTIF_RULES, type MotifCell } from './motifRules';
import { MotifSymmetry } from './MotifSymmetry';
import type { MotifConfig, PatternDoc } from './types';
import { MAX_CHART_SIDE } from './validate';

export const MOTIF_FAMILIES: Readonly<Record<MotifFamily, readonly MotifKind[]>> = {
  [MotifFamily.Bands]: [MotifKind.Stripes, MotifKind.Chevron, MotifKind.Zigzag, MotifKind.Waves, MotifKind.SteppedPeaks],
  [MotifFamily.Tiles]: [MotifKind.Checks, MotifKind.Houndstooth, MotifKind.Argyle, MotifKind.Herringbone, MotifKind.Triangles],
  [MotifFamily.Figures]: [MotifKind.Diamond, MotifKind.Oxo, MotifKind.Crosses, MotifKind.Stars, MotifKind.Hearts],
  [MotifFamily.Free]: [MotifKind.Scatter, MotifKind.Flame, MotifKind.Twist],
};

export const MOTIF_KINDS: readonly MotifKind[] = [
  MotifKind.Diamond,
  MotifKind.Chevron,
  MotifKind.Stripes,
  MotifKind.Checks,
  MotifKind.Zigzag,
  MotifKind.Scatter,
  MotifKind.Waves,
  MotifKind.SteppedPeaks,
  MotifKind.Flame,
  MotifKind.Houndstooth,
  MotifKind.Argyle,
  MotifKind.Herringbone,
  MotifKind.Triangles,
  MotifKind.Twist,
  MotifKind.Oxo,
  MotifKind.Crosses,
  MotifKind.Stars,
  MotifKind.Hearts,
];

const SMALLEST_PERIOD = 2;
const PERIOD_CHOICES = 3;
const NOISE_X = 83492791;
const NOISE_Y = 2654435761;

interface CellFrame {
  readonly tileWidth: number;
  readonly height: number;
  readonly period: number;
  readonly seed: number;
  readonly symmetry: MotifSymmetry;
}

function assertConfig(config: MotifConfig): void {
  const sides = [config.width, config.height];
  if (sides.some((side) => !Number.isInteger(side) || side < 1 || side > MAX_CHART_SIDE)) {
    throw new RangeError(`Motif width and height must be whole numbers from 1 to ${MAX_CHART_SIDE}`);
  }
  if (config.period !== undefined && (!Number.isInteger(config.period) || config.period < 1)) {
    throw new RangeError('Motif period must be a whole number from 1');
  }
}

function motifPalette(config: MotifConfig, rng: Rng): string[] {
  const base = config.baseColour ?? pick(rng, availableDelica()).hex;
  const palette: string[] = [];
  for (const hex of harmony(base, config.colourCount)) {
    palette.push(nearestDelica(hex, palette).code);
  }
  return palette;
}

function motifCell(column: number, row: number, frame: CellFrame): MotifCell {
  const tileX = column % frame.tileWidth;
  const mirroredX = Math.min(tileX, frame.tileWidth - 1 - tileX);
  const x = frame.symmetry === MotifSymmetry.None ? tileX : mirroredX;
  const y = frame.symmetry === MotifSymmetry.Quad ? Math.min(row, frame.height - 1 - row) : row;
  const centre = { centreX: (frame.tileWidth - 1) / 2, centreY: (frame.height - 1) / 2 };
  return { x, y, ...centre, mirroredX, period: frame.period, seed: frame.seed };
}

function noiseShift(cell: MotifCell, noise: number): number {
  if (noise === 0) {
    return 0;
  }
  const hash = Math.imul(cell.x, NOISE_X) ^ Math.imul(cell.y, NOISE_Y) ^ cell.seed;
  return mulberry32(hash)() < noise ? 1 : 0;
}

function bandAt(cell: MotifCell, kind: MotifKind, params: ResolvedMotifParams): number {
  const layered = params.layers.reduce((sum, layer) => sum + MOTIF_RULES[layer](cell), MOTIF_RULES[kind](cell));
  return layered + noiseShift(cell, params.noise);
}

/** Builds a chart from a plain config: same config, same doc. Colours are current Delica beads. */
export function generateMotif(config: MotifConfig): PatternDoc {
  assertConfig(config);
  const params = resolveMotifParams(config.params);
  const { width, height, seed, kind, colourCount } = config;
  const rng = createRng(seed);
  const palette = motifPalette(config, rng);
  const period = config.period ?? SMALLEST_PERIOD + Math.floor(rng() * PERIOD_CHOICES);
  const phase = Math.floor(rng() * colourCount);
  const frame: CellFrame = {
    tileWidth: Math.ceil(width / params.repeat),
    height,
    period: Math.max(1, Math.round(period / params.density)),
    seed,
    symmetry: params.symmetry,
  };
  const cells = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_unused, x) => (bandAt(motifCell(x, y, frame), kind, params) + phase) % colourCount),
  );
  return { version: 1, stitch: config.stitch, width, height, palette, cells };
}
