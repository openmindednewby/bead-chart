import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { build } from 'tsup';

import { CJS_BUILDS } from '../../tsup.config';
import type * as Figures from './index';

const BUILD_TIMEOUT_MS = 180000;

let outDir = '';

beforeAll(async () => {
  outDir = mkdtempSync(join(tmpdir(), 'bead-chart-cjs-'));
  for (const options of CJS_BUILDS) {
    await build({ ...options, outDir, dts: false, silent: true, config: false });
  }
}, BUILD_TIMEOUT_MS);

afterAll(() => {
  rmSync(outDir, { recursive: true, force: true });
});

describe('figures CJS entry', () => {
  it('with require and no vm-modules flag, loads the index and a figure bitmap', async () => {
    const figures = jest.requireActual<typeof Figures>(join(outDir, 'figures.js'));
    const index = await figures.loadFigureIndex();

    const source = await figures.loadFigure(index[0]);

    expect(source?.id).toBe(index[0].id);
    expect(source?.pixels.length).toBeGreaterThan(0);
  });
});
