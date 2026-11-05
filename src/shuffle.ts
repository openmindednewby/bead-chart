import { pick, type Rng } from '@dloizides/game-rng';

import { availableDelica } from './delica';
import { MOTIF_KINDS } from './motif';
import { MOTIF_PRESETS } from './motifPresets';
import { ShuffleField } from './ShuffleField';
import { Stitch } from './Stitch';
import type { MotifConfig, MotifParams, ShuffledMotif } from './types';
import type { MotifKind } from './MotifKind';

export const SHUFFLE_LIMITS = {
  width: { min: 8, max: 40 },
  height: { min: 20, max: 120 },
  seeds: 1000,
} as const;

const STITCHES: readonly Stitch[] = [Stitch.Peyote, Stitch.Brick, Stitch.Loom];
const COLOUR_COUNTS = [2, 3, 4] as const;

interface ShuffledShape {
  readonly kind: MotifKind;
  readonly period: number | undefined;
  readonly params: MotifParams | undefined;
  readonly presetId: string | undefined;
}

function between(rng: Rng, range: { readonly min: number; readonly max: number }): number {
  return range.min + Math.floor(rng() * (range.max - range.min + 1));
}

function shuffledShape(current: MotifConfig, isOpen: (field: ShuffleField) => boolean, rng: Rng): ShuffledShape {
  const kept = { kind: current.kind, period: current.period, params: current.params, presetId: undefined };
  if (!isOpen(ShuffleField.Params)) {
    return isOpen(ShuffleField.Shape) ? { ...kept, kind: pick(rng, MOTIF_KINDS) } : kept;
  }
  const candidates = isOpen(ShuffleField.Shape)
    ? MOTIF_PRESETS
    : MOTIF_PRESETS.filter((preset) => preset.kind === current.kind);
  const preset = pick(rng, candidates);
  return { kind: preset.kind, period: preset.period, params: preset.params, presetId: preset.id };
}

function nextSeed(current: number, rng: Rng): number {
  const step = 1 + Math.floor(rng() * (SHUFFLE_LIMITS.seeds - 1));
  return (current + step) % SHUFFLE_LIMITS.seeds;
}

/** Returns a new motif config that changes every field not in locked; same rng state, same result. */
export function shuffleMotif(current: MotifConfig, locked: readonly ShuffleField[], rng: Rng): ShuffledMotif {
  const isOpen = (field: ShuffleField): boolean => !locked.includes(field);
  const { presetId, ...shape } = shuffledShape(current, isOpen, rng);
  const config: MotifConfig = {
    ...current,
    ...shape,
    stitch: isOpen(ShuffleField.Stitch) ? pick(rng, STITCHES) : current.stitch,
    width: isOpen(ShuffleField.Width) ? between(rng, SHUFFLE_LIMITS.width) : current.width,
    height: isOpen(ShuffleField.Height) ? between(rng, SHUFFLE_LIMITS.height) : current.height,
    colourCount: isOpen(ShuffleField.ColourCount) ? pick(rng, COLOUR_COUNTS) : current.colourCount,
    seed: isOpen(ShuffleField.Seed) ? nextSeed(current.seed, rng) : current.seed,
    baseColour: isOpen(ShuffleField.BaseColour) ? pick(rng, availableDelica()).hex : current.baseColour,
  };
  return { config, presetId };
}
