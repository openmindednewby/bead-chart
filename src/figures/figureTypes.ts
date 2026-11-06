import type { FigureTones } from '../FigureTones';
import type { Stitch } from '../Stitch';

export type FigureChunkRow = readonly [id: string, pixels: string, palette: string];

export type FigureIndexRow = readonly [
  id: string,
  name: string,
  keywords: string,
  category: string,
  family: string,
  chunk: number,
];

export interface FigureChunkModule {
  readonly FIGURE_CHUNK: readonly FigureChunkRow[];
}

export interface FigureSource {
  readonly id: string;
  readonly size: number;
  readonly pixels: string;
  readonly palette: readonly string[];
}

export interface FigureEntry {
  readonly id: string;
  readonly name: string;
  readonly keywords: readonly string[];
  readonly category: string;
  readonly family: string;
  readonly chunk: number;
}

export interface FigureChartOptions {
  readonly stitch: Stitch;
  readonly width?: number;
  readonly colour?: string;
  readonly background?: string;
  readonly tones?: FigureTones;
}

export interface FigureSourceLicence {
  readonly id: string;
  readonly name: string;
  readonly licence: string;
  readonly url: string;
  readonly attribution: string;
  readonly licenceFile: string;
}
