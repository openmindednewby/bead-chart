import type { HarmonyCount } from '@dloizides/color-science';

import type { MotifKind } from './MotifKind';
import type { PatternDocIssue } from './PatternDocIssue';
import type { RowDirection } from './RowDirection';
import type { Stitch } from './Stitch';

export interface PatternDoc {
  readonly version: 1;
  readonly stitch: Stitch;
  readonly width: number;
  readonly height: number;
  readonly palette: readonly string[];
  readonly cells: readonly (readonly number[])[];
}

export interface BeadPosition {
  readonly row: number;
  readonly col: number;
  readonly x: number;
  readonly y: number;
}

export interface ChartGeometry {
  readonly positions: readonly BeadPosition[];
  readonly extentX: number;
  readonly extentY: number;
}

export interface StitchBead extends BeadPosition {
  readonly seq: number;
  readonly code: string;
}

export interface WovenRow {
  readonly rows: readonly number[];
  readonly direction: RowDirection;
  readonly beads: readonly StitchBead[];
}

export interface WordRun {
  readonly code: string;
  readonly count: number;
}

export interface WordRow {
  readonly rows: readonly number[];
  readonly direction: RowDirection;
  readonly beads: number;
  readonly runs: readonly WordRun[];
}

export interface BeadCounts {
  readonly total: number;
  readonly lines: readonly WordRun[];
}

export interface DelicaColour {
  readonly code: string;
  readonly name: string;
  readonly hex: string;
  readonly glass: string;
  readonly discontinued: boolean;
}

export interface ShoppingLine extends WordRun {
  readonly name: string;
  readonly hex: string;
  readonly discontinued: boolean;
}

export interface MotifConfig {
  readonly stitch: Stitch;
  readonly width: number;
  readonly height: number;
  readonly seed: number;
  readonly kind: MotifKind;
  readonly colourCount: HarmonyCount;
  readonly baseColour?: string;
  readonly period?: number;
}

export interface PatternDocValidation {
  readonly ok: boolean;
  readonly issues: readonly PatternDocIssue[];
}

export interface LicenceTerms {
  readonly sellFinishedPieces: boolean;
  readonly creditRequired: boolean;
  readonly resellChart: boolean;
}

export interface ChartSvgOptions {
  readonly label?: string;
}
