import { createRng } from '@dloizides/game-rng';

import { MotifKind } from './MotifKind';
import { findMotifPreset } from './motifPresets';
import { ShuffleField } from './ShuffleField';
import { SHUFFLE_LIMITS, shuffleMotif } from './shuffle';
import { Stitch } from './Stitch';
import type { MotifConfig } from './types';

const current: MotifConfig = {
  stitch: Stitch.Peyote,
  width: 12,
  height: 60,
  seed: 500,
  kind: MotifKind.Diamond,
  colourCount: 3,
  baseColour: '#2D2E37',
};

const ALL_FIELDS = [
  ShuffleField.Stitch,
  ShuffleField.Width,
  ShuffleField.Height,
  ShuffleField.Shape,
  ShuffleField.Params,
  ShuffleField.ColourCount,
  ShuffleField.Seed,
  ShuffleField.BaseColour,
];

const distinct = (values: readonly unknown[]): number => new Set(values.map((value) => JSON.stringify(value))).size;

describe('shuffleMotif', () => {
  it('with the same rng seed, returns the same result', () => {
    const first = shuffleMotif(current, [], createRng(3));

    const second = shuffleMotif(current, [], createRng(3));

    expect(second).toEqual(first);
  });

  it('with nothing locked, over 50 shuffles varies shape, stitch, size, colours and params', () => {
    const rng = createRng(11);

    const results = Array.from({ length: 50 }, () => shuffleMotif(current, [], rng).config);

    expect(distinct(results.map((config) => config.kind))).toBeGreaterThan(5);
    expect(distinct(results.map((config) => config.stitch))).toBe(3);
    expect(distinct(results.map((config) => config.width))).toBeGreaterThan(5);
    expect(distinct(results.map((config) => config.height))).toBeGreaterThan(5);
    expect(distinct(results.map((config) => config.colourCount))).toBe(3);
    expect(distinct(results.map((config) => config.baseColour))).toBeGreaterThan(5);
    expect(distinct(results.map((config) => config.params))).toBeGreaterThan(5);
  });

  it('with nothing locked, always changes the seed and stays inside the limits', () => {
    const rng = createRng(19);
    const { width, height, seeds } = SHUFFLE_LIMITS;

    const results = Array.from({ length: 200 }, () => shuffleMotif(current, [], rng).config);

    expect(results.every((config) => config.seed !== current.seed && config.seed >= 0 && config.seed < seeds)).toBe(true);
    expect(results.every((config) => config.width >= width.min && config.width <= width.max)).toBe(true);
    expect(results.every((config) => config.height >= height.min && config.height <= height.max)).toBe(true);
  });

  it('with every field locked, returns the current config and no preset', () => {
    const result = shuffleMotif(current, ALL_FIELDS, createRng(4));

    expect(result).toEqual({ config: current, presetId: undefined });
  });

  it('with stitch, width and height locked, keeps them and changes the seed', () => {
    const locked = [ShuffleField.Stitch, ShuffleField.Width, ShuffleField.Height];

    const { config } = shuffleMotif(current, locked, createRng(8));

    expect([config.stitch, config.width, config.height]).toEqual([current.stitch, current.width, current.height]);
    expect(config.seed).not.toBe(current.seed);
  });

  it('with shape and params unlocked, returns a preset matching the config', () => {
    const { config, presetId } = shuffleMotif(current, [], createRng(21));

    const preset = findMotifPreset(presetId ?? '');

    expect(preset?.kind).toBe(config.kind);
    expect(config.params).toEqual(preset?.params);
  });

  it('with the shape locked and params unlocked, keeps the shape and picks one of its presets', () => {
    const rng = createRng(2);

    const results = Array.from({ length: 20 }, () => shuffleMotif(current, [ShuffleField.Shape], rng));

    const kinds = results.map((result) => [result.config.kind, findMotifPreset(result.presetId ?? '')?.kind]);

    expect(kinds.every(([kind, presetKind]) => kind === current.kind && presetKind === current.kind)).toBe(true);
  });

  it('with params locked and the shape unlocked, keeps the params and returns no preset', () => {
    const withParams = { ...current, params: { noise: 0.1 } };

    const { config, presetId } = shuffleMotif(withParams, [ShuffleField.Params], createRng(6));

    expect(config.params).toEqual(withParams.params);
    expect(presetId).toBeUndefined();
  });
});
