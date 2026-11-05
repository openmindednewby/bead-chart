import { MotifKind } from '../../MotifKind';
import { MotifSymmetry } from '../../MotifSymmetry';
import type { PresetRow } from './PresetRow';

const MIRROR = MotifSymmetry.Mirror;
const QUAD = MotifSymmetry.Quad;

export const BAND_PRESETS: readonly PresetRow[] = [
  ['stripes-classic', 'Classic stripes', MotifKind.Stripes, 3, {}, 2],
  ['stripes-wide', 'Wide bands', MotifKind.Stripes, 2, {}, 4],
  ['stripes-pinstripe', 'Pinstripe', MotifKind.Stripes, 4, { density: 2 }, 2],
  ['stripes-ombre', 'Ombre fade', MotifKind.Stripes, 4, { noise: 0.25 }, 3],
  ['stripes-woven', 'Woven stripes', MotifKind.Stripes, 3, { layers: [MotifKind.Checks] }, 3],
  ['stripes-mirror', 'Mirror bands', MotifKind.Stripes, 3, { symmetry: QUAD }, 3],
  ['chevron-classic', 'Classic chevron', MotifKind.Chevron, 3, {}, 2],
  ['chevron-bold', 'Bold chevron', MotifKind.Chevron, 2, { density: 0.5 }, 2],
  ['chevron-arrows', 'Arrow band', MotifKind.Chevron, 3, { repeat: 2 }, 2],
  ['chevron-diamonds', 'Chevron diamonds', MotifKind.Chevron, 4, { symmetry: QUAD }, 2],
  ['chevron-feather', 'Feather chevron', MotifKind.Chevron, 4, { repeat: 3, density: 1.5 }, 3],
  ['chevron-rough', 'Hand-drawn chevron', MotifKind.Chevron, 3, { noise: 0.15 }, 3],
  ['zigzag-classic', 'Classic zigzag', MotifKind.Zigzag, 3, {}, 2],
  ['zigzag-lightning', 'Lightning', MotifKind.Zigzag, 2, { density: 2 }, 3],
  ['zigzag-tall', 'Tall zigzag', MotifKind.Zigzag, 4, {}, 4],
  ['zigzag-mirror', 'Mirrored zigzag', MotifKind.Zigzag, 3, { symmetry: MIRROR }, 3],
  ['zigzag-ric-rac', 'Ric-rac', MotifKind.Zigzag, 4, { layers: [MotifKind.Stripes] }, 2],
  ['zigzag-diamond', 'Zigzag diamonds', MotifKind.Zigzag, 3, { symmetry: QUAD, repeat: 2 }, 3],
  ['waves-classic', 'Gentle waves', MotifKind.Waves, 3, {}, 3],
  ['waves-ripple', 'Ripple', MotifKind.Waves, 4, { density: 2 }, 3],
  ['waves-swell', 'Ocean swell', MotifKind.Waves, 2, {}, 5],
  ['waves-scallop', 'Scallops', MotifKind.Waves, 3, { symmetry: MIRROR, repeat: 2 }, 3],
  ['waves-tide', 'Tide pool', MotifKind.Waves, 4, { noise: 0.2 }, 4],
  ['waves-ribbon', 'Ribbon waves', MotifKind.Waves, 3, { symmetry: QUAD }, 4],
  ['peaks-classic', 'Stepped peaks', MotifKind.SteppedPeaks, 3, {}, 2],
  ['peaks-fair-isle', 'Fair Isle peaks', MotifKind.SteppedPeaks, 4, {}, 3],
  ['peaks-temple', 'Temple steps', MotifKind.SteppedPeaks, 2, { symmetry: MIRROR }, 2],
  ['peaks-mountain', 'Mountain range', MotifKind.SteppedPeaks, 3, { repeat: 2 }, 3],
  ['peaks-aztec', 'Aztec steps', MotifKind.SteppedPeaks, 4, { symmetry: QUAD }, 2],
  ['peaks-skyline', 'Skyline', MotifKind.SteppedPeaks, 3, { density: 0.5, noise: 0.1 }, 2],
];
