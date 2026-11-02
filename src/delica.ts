import { hexToOklab, nearestInPalette, type Oklab } from '@dloizides/color-science';

import data from './data/delica.json';
import type { DelicaColour } from './types';

interface LabEntry {
  readonly colour: DelicaColour;
  readonly lab: Oklab;
}

export const DELICA_COLOURS: readonly DelicaColour[] = data;

export const DELICA_ATTRIBUTION = {
  credit: 'Color data: craft-color-codes by MakeBead (https://makebead.com)',
  url: 'https://makebead.com',
  sourceUrl: 'https://github.com/makebead/craft-color-codes',
  sourceCommit: '84dbdc26a961247f2aba58c91f314966a38e64ae',
  licence: 'CC BY 4.0',
  licenceUrl: 'https://creativecommons.org/licenses/by/4.0/',
  changes: 'Dropped the rgb field; set discontinued on every colour.',
} as const;

let byCode: Map<string, DelicaColour> | undefined;
let available: readonly LabEntry[] | undefined;

function codeIndex(): Map<string, DelicaColour> {
  byCode ??= new Map(DELICA_COLOURS.map((colour) => [colour.code, colour]));
  return byCode;
}

function availableEntries(): readonly LabEntry[] {
  available ??= DELICA_COLOURS.filter((colour) => !colour.discontinued).map((colour) => ({
    colour,
    lab: hexToOklab(colour.hex),
  }));
  return available;
}

/** The colour with this code, or undefined when the Delica list has no such code. */
export function findDelica(code: string): DelicaColour | undefined {
  return codeIndex().get(code);
}

/** The colour with this code. Throws when the Delica list has no such code. */
export function requireDelica(code: string): DelicaColour {
  const colour = findDelica(code);
  if (colour === undefined) {
    throw new Error(`Unknown Delica code: ${code}`);
  }
  return colour;
}

/** Every colour still in production. */
export function availableDelica(): DelicaColour[] {
  return availableEntries().map((entry) => entry.colour);
}

/** The current bead closest to a hex in OKLab, skipping the excluded codes. */
export function nearestDelica(hex: string, excludedCodes: readonly string[] = []): DelicaColour {
  const pool = availableEntries().filter((entry) => !excludedCodes.includes(entry.colour.code));
  const match = pool[nearestInPalette(hexToOklab(hex), pool.map((entry) => entry.lab))];
  if (match === undefined) {
    throw new RangeError('Every current Delica colour is excluded');
  }
  return match.colour;
}
