import type { MotifKind } from './MotifKind';
import { MotifSymmetry } from './MotifSymmetry';
import type { MotifParams } from './types';

export interface ResolvedMotifParams {
  readonly symmetry: MotifSymmetry;
  readonly repeat: number;
  readonly density: number;
  readonly layers: readonly MotifKind[];
  readonly noise: number;
}

export const MOTIF_PARAM_LIMITS = {
  symmetries: [MotifSymmetry.None, MotifSymmetry.Mirror, MotifSymmetry.Quad] as readonly MotifSymmetry[],
  repeat: { min: 1, max: 6 },
  density: { min: 0.25, max: 4 },
  noise: { min: 0, max: 1 },
  maxLayers: 2,
} as const;

const DEFAULT_PARAMS: ResolvedMotifParams = {
  symmetry: MotifSymmetry.None,
  repeat: 1,
  density: 1,
  layers: [],
  noise: 0,
};

function inRange(value: number, range: { readonly min: number; readonly max: number }): boolean {
  return value >= range.min && value <= range.max;
}

/** Fills the defaults and throws a RangeError for any control outside MOTIF_PARAM_LIMITS. */
export function resolveMotifParams(params: MotifParams | undefined): ResolvedMotifParams {
  const resolved = { ...DEFAULT_PARAMS, ...params };
  const limits = MOTIF_PARAM_LIMITS;
  if (!Number.isInteger(resolved.repeat) || !inRange(resolved.repeat, limits.repeat)) {
    throw new RangeError(`Motif repeat must be a whole number from ${limits.repeat.min} to ${limits.repeat.max}`);
  }
  if (!inRange(resolved.density, limits.density)) {
    throw new RangeError(`Motif density must be from ${limits.density.min} to ${limits.density.max}`);
  }
  if (!inRange(resolved.noise, limits.noise)) {
    throw new RangeError(`Motif noise must be from ${limits.noise.min} to ${limits.noise.max}`);
  }
  if (resolved.layers.length > limits.maxLayers) {
    throw new RangeError(`A motif takes at most ${limits.maxLayers} layers`);
  }
  return resolved;
}
