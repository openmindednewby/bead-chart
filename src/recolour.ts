import { hexToOklab, nearestInPalette } from '@dloizides/color-science';

import { requireDelica } from './delica';
import type { PatternDoc } from './types';

/** A copy of the doc with its colours swapped. Geometry is untouched; merged colours share an entry. */
export function recolour(
  doc: PatternDoc,
  mapping: Readonly<Record<string, string | undefined>>,
): PatternDoc {
  const targets = doc.palette.map((code) => requireDelica(mapping[code] ?? code).code);
  const palette = [...new Set(targets)];
  const remap = targets.map((code) => palette.indexOf(code));
  const cells = doc.cells.map((row) => row.map((index) => remap[index] ?? index));
  return { ...doc, palette, cells };
}

/** Moves every colour of the doc to its nearest colour, in OKLab, from the given Delica codes. */
export function recolourToPalette(doc: PatternDoc, codes: readonly string[]): PatternDoc {
  if (codes.length === 0) {
    throw new RangeError('recolourToPalette: codes must not be empty');
  }
  const labs = codes.map((code) => hexToOklab(requireDelica(code).hex));
  const mapping: Record<string, string | undefined> = {};
  for (const code of doc.palette) {
    mapping[code] = codes[nearestInPalette(hexToOklab(requireDelica(code).hex), labs)];
  }
  return recolour(doc, mapping);
}
