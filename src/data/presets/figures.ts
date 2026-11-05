import { MotifKind } from '../../MotifKind';
import { MotifSymmetry } from '../../MotifSymmetry';
import type { PresetRow } from './PresetRow';

const MIRROR = MotifSymmetry.Mirror;
const QUAD = MotifSymmetry.Quad;

export const FIGURE_PRESETS: readonly PresetRow[] = [
  ['diamond-classic', 'Classic diamond', MotifKind.Diamond, 3, {}, 2],
  ['diamond-bullseye', 'Bullseye diamond', MotifKind.Diamond, 4, {}, 2],
  ['diamond-lattice', 'Diamond lattice', MotifKind.Diamond, 3, { repeat: 2 }, 2],
  ['diamond-chain', 'Diamond chain', MotifKind.Diamond, 2, { repeat: 3 }, 2],
  ['diamond-jewel', 'Jewel diamond', MotifKind.Diamond, 4, { layers: [MotifKind.Checks] }, 3],
  ['diamond-wide', 'Wide diamond', MotifKind.Diamond, 3, {}, 4],
  ['oxo-classic', 'Classic OXO', MotifKind.Oxo, 2, {}, 2],
  ['oxo-large', 'Large OXO', MotifKind.Oxo, 2, {}, 3],
  ['oxo-banded', 'Banded OXO', MotifKind.Oxo, 3, { layers: [MotifKind.Stripes] }, 2],
  ['oxo-mirror', 'Mirrored OXO', MotifKind.Oxo, 2, { symmetry: MIRROR }, 2],
  ['oxo-sampler', 'OXO sampler', MotifKind.Oxo, 4, { layers: [MotifKind.Stripes] }, 3],
  ['oxo-chequered', 'Chequered OXO', MotifKind.Oxo, 3, { layers: [MotifKind.Checks] }, 2],
  ['crosses-classic', 'Classic crosses', MotifKind.Crosses, 2, {}, 2],
  ['crosses-large', 'Large crosses', MotifKind.Crosses, 2, {}, 4],
  ['crosses-swiss', 'Swiss crosses', MotifKind.Crosses, 3, { layers: [MotifKind.Checks] }, 3],
  ['crosses-sampler', 'Cross-stitch sampler', MotifKind.Crosses, 3, { layers: [MotifKind.Stripes] }, 2],
  ['crosses-scattered', 'Scattered crosses', MotifKind.Crosses, 2, { noise: 0.1 }, 3],
  ['crosses-mirror', 'Mirrored crosses', MotifKind.Crosses, 2, { symmetry: QUAD }, 3],
  ['stars-classic', 'Classic stars', MotifKind.Stars, 3, {}, 2],
  ['stars-large', 'Large stars', MotifKind.Stars, 3, {}, 3],
  ['stars-night', 'Night sky', MotifKind.Stars, 3, { noise: 0.05 }, 4],
  ['stars-snowflake', 'Snowflakes', MotifKind.Stars, 2, {}, 3],
  ['stars-banded', 'Banded stars', MotifKind.Stars, 4, { layers: [MotifKind.Stripes] }, 2],
  ['stars-mirror', 'Mirrored stars', MotifKind.Stars, 3, { symmetry: QUAD }, 4],
  ['hearts-classic', 'Classic hearts', MotifKind.Hearts, 2, {}, 2],
  ['hearts-large', 'Large hearts', MotifKind.Hearts, 2, {}, 4],
  ['hearts-row', 'Row of hearts', MotifKind.Hearts, 3, { layers: [MotifKind.Stripes] }, 2],
  ['hearts-mirror', 'Mirrored hearts', MotifKind.Hearts, 2, { symmetry: MIRROR }, 3],
  ['hearts-valentine', 'Valentine', MotifKind.Hearts, 3, { layers: [MotifKind.Checks] }, 3],
  ['hearts-upside', 'Tumbling hearts', MotifKind.Hearts, 2, { symmetry: QUAD }, 4],
];
