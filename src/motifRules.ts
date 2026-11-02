import { mulberry32 } from '@dloizides/game-rng';

import { MotifKind } from './MotifKind';

export interface MotifCell {
  readonly x: number;
  readonly y: number;
  readonly centreX: number;
  readonly centreY: number;
  readonly mirroredX: number;
  readonly period: number;
  readonly seed: number;
}

const SCATTER_BANDS = 1024;
const HASH_X = 73856093;
const HASH_Y = 19349663;

function scatterBand(cell: MotifCell): number {
  const block = Math.floor(cell.y / cell.period);
  const hash = Math.imul(cell.mirroredX, HASH_X) ^ Math.imul(block, HASH_Y) ^ cell.seed;
  return Math.floor(mulberry32(hash)() * SCATTER_BANDS);
}

function zigzagBand(cell: MotifCell): number {
  const wave = Math.abs((cell.x % (2 * cell.period)) - cell.period);
  return Math.floor((wave + cell.y) / cell.period);
}

export const MOTIF_RULES: Readonly<Record<MotifKind, (cell: MotifCell) => number>> = {
  [MotifKind.Diamond]: (cell) =>
    Math.floor((Math.abs(cell.x - cell.centreX) + Math.abs(cell.y - cell.centreY)) / cell.period),
  [MotifKind.Chevron]: (cell) =>
    Math.floor((Math.abs(cell.x - cell.centreX) + cell.y) / cell.period),
  [MotifKind.Stripes]: (cell) => Math.floor(cell.y / cell.period),
  [MotifKind.Checks]: (cell) =>
    Math.floor(cell.x / cell.period) + Math.floor(cell.y / cell.period),
  [MotifKind.Zigzag]: zigzagBand,
  [MotifKind.Scatter]: scatterBand,
};
