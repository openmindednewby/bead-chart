import { harmony } from '@dloizides/color-science';
import { createRng, pick, type Rng } from '@dloizides/game-rng';

import { availableDelica, nearestDelica } from './delica';
import { MOTIF_RULES } from './motifRules';
import { MotifKind } from './MotifKind';
import type { MotifConfig, PatternDoc } from './types';
import { MAX_CHART_SIDE } from './validate';

export const MOTIF_KINDS: readonly MotifKind[] = [
  MotifKind.Diamond,
  MotifKind.Chevron,
  MotifKind.Stripes,
  MotifKind.Checks,
  MotifKind.Zigzag,
  MotifKind.Scatter,
];

const SMALLEST_PERIOD = 2;
const PERIOD_CHOICES = 3;

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

/** Builds a chart from a plain config: same config, same doc. Colours are current Delica beads. */
export function generateMotif(config: MotifConfig): PatternDoc {
  assertConfig(config);
  const { width, height, seed, kind, colourCount } = config;
  const rng = createRng(seed);
  const palette = motifPalette(config, rng);
  const period = config.period ?? SMALLEST_PERIOD + Math.floor(rng() * PERIOD_CHOICES);
  const phase = Math.floor(rng() * colourCount);
  const rule = MOTIF_RULES[kind];
  const cells = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_unused, x) => {
      const mirroredX = Math.min(x, width - 1 - x);
      const centre = { centreX: (width - 1) / 2, centreY: (height - 1) / 2 };
      return (rule({ x, y, ...centre, mirroredX, period, seed }) + phase) % colourCount;
    }),
  );
  return { version: 1, stitch: config.stitch, width, height, palette, cells };
}
