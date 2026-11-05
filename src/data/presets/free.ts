import { MotifKind } from '../../MotifKind';
import { MotifSymmetry } from '../../MotifSymmetry';
import type { PresetRow } from './PresetRow';

const MIRROR = MotifSymmetry.Mirror;
const QUAD = MotifSymmetry.Quad;

export const FREE_PRESETS: readonly PresetRow[] = [
  ['scatter-classic', 'Classic scatter', MotifKind.Scatter, 3, {}, 2],
  ['scatter-confetti', 'Confetti', MotifKind.Scatter, 4, { density: 2 }, 2],
  ['scatter-terrazzo', 'Terrazzo', MotifKind.Scatter, 4, {}, 4],
  ['scatter-pixel', 'Pixel noise', MotifKind.Scatter, 2, {}, 1],
  ['scatter-tiled', 'Tiled scatter', MotifKind.Scatter, 3, { repeat: 2 }, 3],
  ['scatter-mosaic', 'Mosaic', MotifKind.Scatter, 3, { symmetry: QUAD }, 3],
  ['flame-classic', 'Bargello flame', MotifKind.Flame, 4, {}, 2],
  ['flame-ember', 'Embers', MotifKind.Flame, 4, { noise: 0.2 }, 2],
  ['flame-tall', 'Tall flames', MotifKind.Flame, 3, {}, 3],
  ['flame-mirror', 'Mirrored flame', MotifKind.Flame, 4, { symmetry: MIRROR }, 3],
  ['flame-bonfire', 'Bonfire', MotifKind.Flame, 3, { repeat: 2 }, 2],
  ['flame-aurora', 'Aurora', MotifKind.Flame, 4, { layers: [MotifKind.Waves] }, 3],
  ['twist-classic', 'Classic twist', MotifKind.Twist, 3, {}, 2],
  ['twist-rope', 'Rope', MotifKind.Twist, 4, {}, 2],
  ['twist-candy', 'Candy cane', MotifKind.Twist, 2, {}, 3],
  ['twist-braid', 'Braid', MotifKind.Twist, 3, { symmetry: MIRROR }, 2],
  ['twist-spiral', 'Spiral', MotifKind.Twist, 4, { repeat: 2 }, 3],
  ['twist-lattice', 'Twist lattice', MotifKind.Twist, 3, { symmetry: QUAD, repeat: 2 }, 2],
];
