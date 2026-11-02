import { Stitch } from './Stitch';
import type { PatternDoc } from './types';

export function solidDoc(stitch: Stitch, width: number, height: number): PatternDoc {
  return {
    version: 1,
    stitch,
    width,
    height,
    palette: ['DB0001'],
    cells: Array.from({ length: height }, () => Array.from({ length: width }, () => 0)),
  };
}
