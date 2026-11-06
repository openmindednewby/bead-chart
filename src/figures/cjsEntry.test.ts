import { join } from 'path';

import type * as Figures from './index';

const CJS_ENTRY = join(__dirname, '..', '..', 'dist', 'figures.js');

describe('figures CJS entry', () => {
  it('with require and no vm-modules flag, loads the index and a figure bitmap', async () => {
    const figures = jest.requireActual<typeof Figures>(CJS_ENTRY);
    const index = await figures.loadFigureIndex();

    const source = await figures.loadFigure(index[0]);

    expect(source?.id).toBe(index[0].id);
    expect(source?.pixels.length).toBeGreaterThan(0);
  });
});
