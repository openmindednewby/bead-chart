import { FIGURE_SOURCE_SIZE } from '../figureBitmap';
import { CHUNK_LOADERS } from './generated/chunkLoaders';
import type { FigureEntry, FigureIndexRow, FigureSource } from './figureTypes';

export { FIGURE_FAMILIES } from './generated/figureFamilies';
export { figureLicence, FIGURE_LICENCES } from './figureLicences';
export { searchFigures } from './searchFigures';
export type { FigureChartOptions, FigureEntry, FigureSource, FigureSourceLicence } from './figureTypes';

let indexPromise: Promise<readonly FigureEntry[]> | undefined;

function toEntry([id, name, keywords, category, family, chunk]: FigureIndexRow): FigureEntry {
  return { id, name, keywords: keywords.split(' '), category, family, chunk };
}

/** Lazily loads the names, keywords and chunk of every figure in the catalogue. */
export function loadFigureIndex(): Promise<readonly FigureEntry[]> {
  indexPromise ??= import('./generated/figureIndex').then(({ FIGURE_INDEX }) => FIGURE_INDEX.map(toEntry));
  return indexPromise;
}

/** Lazily loads the bitmap of one catalogue figure from its chunk. */
export async function loadFigure(entry: FigureEntry): Promise<FigureSource | undefined> {
  const loader = CHUNK_LOADERS[entry.chunk];
  const rows = loader === undefined ? [] : (await loader()).FIGURE_CHUNK;
  const row = rows.find(([id]) => id === entry.id);
  if (row === undefined) {
    return undefined;
  }
  const [id, pixels, palette] = row;
  return { id, size: FIGURE_SOURCE_SIZE, pixels, palette: palette === '' ? [] : palette.split(',') };
}
