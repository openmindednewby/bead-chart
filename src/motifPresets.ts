import { BAND_PRESETS } from './data/presets/bands';
import { FIGURE_PRESETS } from './data/presets/figures';
import { FREE_PRESETS } from './data/presets/free';
import type { PresetRow } from './data/presets/PresetRow';
import { TILE_PRESETS } from './data/presets/tiles';
import { MotifFamily } from './MotifFamily';
import type { MotifConfig, MotifPreset } from './types';

export type PresetBase = Pick<MotifConfig, 'stitch' | 'width' | 'height' | 'seed' | 'baseColour'>;

function toPresets(family: MotifFamily, rows: readonly PresetRow[]): MotifPreset[] {
  return rows.map(([id, name, kind, colourCount, params, period]) => ({ id, name, family, kind, colourCount, period, params }));
}

export const MOTIF_PRESETS: readonly MotifPreset[] = [
  ...toPresets(MotifFamily.Bands, BAND_PRESETS),
  ...toPresets(MotifFamily.Tiles, TILE_PRESETS),
  ...toPresets(MotifFamily.Figures, FIGURE_PRESETS),
  ...toPresets(MotifFamily.Free, FREE_PRESETS),
];

const PRESETS_BY_ID = new Map(MOTIF_PRESETS.map((preset) => [preset.id, preset]));

/** Returns the preset with this id, or undefined. */
export function findMotifPreset(id: string): MotifPreset | undefined {
  return PRESETS_BY_ID.get(id);
}

/** Builds a full motif config from a preset plus the piece's stitch, size and seed. */
export function presetConfig(preset: MotifPreset, base: PresetBase): MotifConfig {
  const { kind, colourCount, period, params } = preset;
  return { ...base, kind, colourCount, period, params };
}
