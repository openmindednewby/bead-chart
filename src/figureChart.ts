import { hexToOklab, oklabToHex } from '@dloizides/color-science';

import { nearestDelica } from './delica';
import { decodeFigureBitmap } from './figureBitmap';
import type { FigureChartOptions, FigureSource } from './figures/figureTypes';
import { sampleFigure } from './figureSample';
import { FigureTones } from './FigureTones';
import type { PatternDoc } from './types';
import { MAX_CHART_SIDE } from './validate';

export const FIGURE_MIN_WIDTH = 40;

const DEFAULT_COLOUR = '#a8322b';
const DEFAULT_BACKGROUND = '#f2eee4';
const LIGHT_SHIFT = 0.16;
const DARK_SHIFT = -0.2;
const BASE = 1;
const LIGHT = 2;

const paletteCache = new Map<string, readonly string[]>();
const beadCache = new Map<string, string>();

/** The chart width for a figure: whole beads, at least 40, at most the chart side limit. */
export function figureWidth(width: number = FIGURE_MIN_WIDTH): number {
  return Math.min(MAX_CHART_SIDE, Math.max(FIGURE_MIN_WIDTH, Math.round(width)));
}

function shifted(hex: string, delta: number): string {
  const lab = hexToOklab(hex);
  return oklabToHex({ ...lab, L: Math.min(1, Math.max(0, lab.L + delta)) });
}

function tonePalette(colour: string, background: string, tones: FigureTones): readonly string[] {
  const key = `${colour}|${background}|${tones}`;
  const cached = paletteCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const bg = nearestDelica(background).code;
  const base = nearestDelica(colour, [bg]);
  const light = tones === FigureTones.Three ? [nearestDelica(shifted(base.hex, LIGHT_SHIFT), [bg, base.code]).code] : [];
  const dark = nearestDelica(shifted(base.hex, DARK_SHIFT), [bg, base.code, ...light]).code;
  const palette = [bg, base.code, ...light, dark];
  paletteCache.set(key, palette);
  return palette;
}

function isEmpty(cells: readonly (readonly number[])[], row: number, col: number): boolean {
  return (cells[row]?.[col] ?? 0) === 0;
}

function tone(cells: readonly (readonly number[])[], row: number, col: number, tones: FigureTones): number {
  const lit = isEmpty(cells, row + 1, col) || isEmpty(cells, row, col - 1);
  const shaded = isEmpty(cells, row - 1, col) || isEmpty(cells, row, col + 1);
  const dark = tones === FigureTones.Three ? LIGHT + 1 : LIGHT;
  if (lit && tones === FigureTones.Three) {
    return LIGHT;
  }
  return shaded ? dark : BASE;
}

function shadeGlyph(cells: number[][], options: FigureChartOptions): PatternDoc['cells'] {
  const tones = options.tones ?? FigureTones.Three;
  return cells.map((row, r) => row.map((cell, c) => (cell === 0 ? 0 : tone(cells, r, c, tones))));
}

function bead(hex: string, background: string): string {
  const key = `${hex}|${background}`;
  const code = beadCache.get(key) ?? nearestDelica(hex, [background]).code;
  beadCache.set(key, code);
  return code;
}

function colourPalette(source: FigureSource, background: string): { palette: string[]; remap: number[] } {
  const palette = [background];
  const remap = [0];
  for (const hex of source.palette) {
    const code = bead(hex, background);
    if (!palette.includes(code)) {
      palette.push(code);
    }
    remap.push(palette.indexOf(code));
  }
  return { palette, remap };
}

/** Rasterises a figure on the bead centres of the stitch, quantised to Delica, glyphs shaded from a top-left light. */
export function figureToChart(source: FigureSource, options: FigureChartOptions): PatternDoc {
  const width = figureWidth(options.width);
  const sampled = sampleFigure(decodeFigureBitmap(source.pixels, source.size), source.size, options.stitch, width);
  const background = options.background ?? DEFAULT_BACKGROUND;
  const frame = { version: 1 as const, stitch: options.stitch, width, height: sampled.length };
  if (source.palette.length === 0) {
    const palette = tonePalette(options.colour ?? DEFAULT_COLOUR, background, options.tones ?? FigureTones.Three);
    return { ...frame, palette, cells: shadeGlyph(sampled, options) };
  }
  const { palette, remap } = colourPalette(source, nearestDelica(background).code);
  return { ...frame, palette, cells: sampled.map((row) => row.map((cell) => remap[cell] ?? 0)) };
}
