import { MotifKind } from '../../MotifKind';
import { MotifSymmetry } from '../../MotifSymmetry';
import type { PresetRow } from './PresetRow';

const MIRROR = MotifSymmetry.Mirror;
const QUAD = MotifSymmetry.Quad;

export const TILE_PRESETS: readonly PresetRow[] = [
  ['checks-classic', 'Classic checks', MotifKind.Checks, 2, {}, 2],
  ['checks-gingham', 'Gingham', MotifKind.Checks, 3, {}, 3],
  ['checks-chessboard', 'Chessboard', MotifKind.Checks, 2, {}, 4],
  ['checks-plaid', 'Plaid', MotifKind.Checks, 4, { layers: [MotifKind.Stripes] }, 3],
  ['checks-tiny', 'Tiny checks', MotifKind.Checks, 3, { density: 2 }, 2],
  ['checks-tartan', 'Tartan', MotifKind.Checks, 4, { layers: [MotifKind.Stripes, MotifKind.Twist] }, 2],
  ['houndstooth-classic', 'Classic houndstooth', MotifKind.Houndstooth, 2, {}, 2],
  ['houndstooth-large', 'Large houndstooth', MotifKind.Houndstooth, 2, {}, 4],
  ['houndstooth-duo', 'Two-tone houndstooth', MotifKind.Houndstooth, 3, { layers: [MotifKind.Stripes] }, 2],
  ['houndstooth-mirror', 'Mirrored houndstooth', MotifKind.Houndstooth, 2, { symmetry: MIRROR }, 2],
  ['houndstooth-pied', 'Pied de poule', MotifKind.Houndstooth, 3, { layers: [MotifKind.Checks] }, 4],
  ['houndstooth-worn', 'Worn houndstooth', MotifKind.Houndstooth, 2, { noise: 0.1 }, 4],
  ['argyle-classic', 'Classic argyle', MotifKind.Argyle, 3, {}, 2],
  ['argyle-large', 'Large argyle', MotifKind.Argyle, 3, {}, 3],
  ['argyle-golf', 'Golf argyle', MotifKind.Argyle, 4, { layers: [MotifKind.Stripes] }, 2],
  ['argyle-plain', 'Plain harlequin', MotifKind.Argyle, 2, {}, 3],
  ['argyle-mirror', 'Mirrored argyle', MotifKind.Argyle, 3, { symmetry: QUAD }, 3],
  ['argyle-dense', 'Dense argyle', MotifKind.Argyle, 4, { density: 0.5 }, 2],
  ['herringbone-classic', 'Classic herringbone', MotifKind.Herringbone, 2, {}, 2],
  ['herringbone-tweed', 'Tweed', MotifKind.Herringbone, 3, { noise: 0.2 }, 3],
  ['herringbone-broad', 'Broad herringbone', MotifKind.Herringbone, 3, {}, 4],
  ['herringbone-parquet', 'Parquet', MotifKind.Herringbone, 4, {}, 3],
  ['herringbone-mirror', 'Mirrored herringbone', MotifKind.Herringbone, 2, { symmetry: QUAD }, 3],
  ['herringbone-fishbone', 'Fishbone', MotifKind.Herringbone, 4, { layers: [MotifKind.Stripes] }, 2],
  ['triangles-classic', 'Classic triangles', MotifKind.Triangles, 2, {}, 3],
  ['triangles-bunting', 'Bunting', MotifKind.Triangles, 3, { symmetry: MIRROR }, 3],
  ['triangles-sawtooth', 'Sawtooth', MotifKind.Triangles, 3, {}, 4],
  ['triangles-pinwheel', 'Pinwheel', MotifKind.Triangles, 4, { symmetry: QUAD, repeat: 2 }, 3],
  ['triangles-shards', 'Shards', MotifKind.Triangles, 4, { noise: 0.15 }, 2],
  ['triangles-pyramids', 'Pyramids', MotifKind.Triangles, 3, { repeat: 3 }, 2],
];
