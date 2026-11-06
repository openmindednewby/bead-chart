import type { FigureSourceLicence } from './figureTypes';

const EMOJI_FAMILY = 'NotoEmoji';

export const FIGURE_LICENCES: readonly FigureSourceLicence[] = [
  {
    id: 'noto-fonts',
    name: 'Noto fonts',
    licence: 'OFL-1.1',
    url: 'https://github.com/notofonts/notofonts.github.io',
    attribution: 'Glyph figures rasterised from Noto fonts, Copyright Google LLC and the Noto Project Authors, SIL Open Font License 1.1.',
    licenceFile: 'LICENSES/OFL-1.1-noto-fonts.txt',
  },
  {
    id: 'noto-emoji',
    name: 'Noto Emoji images',
    licence: 'Apache-2.0',
    url: 'https://github.com/googlefonts/noto-emoji',
    attribution: 'Figures derived from Noto Emoji, Copyright Google Inc., Apache License 2.0, modified (rasterised to beads, colours quantised to Delica).',
    licenceFile: 'LICENSES/Apache-2.0-noto-emoji.txt',
  },
  {
    id: 'unicode-cldr',
    name: 'Unicode CLDR annotations and emoji-test.txt',
    licence: 'Unicode-3.0',
    url: 'https://github.com/unicode-org/cldr-json',
    attribution: 'Figure names, keywords and emoji groups from Unicode CLDR and Unicode emoji data, Copyright Unicode, Inc., Unicode License v3.',
    licenceFile: 'LICENSES/Unicode-3.0.txt',
  },
];

/** The licence record covering the bitmap of a figure from this source family. */
export function figureLicence(family: string): FigureSourceLicence {
  const id = family === EMOJI_FAMILY ? 'noto-emoji' : 'noto-fonts';
  return FIGURE_LICENCES.find((licence) => licence.id === id) as FigureSourceLicence;
}
