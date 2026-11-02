import { beadCode } from './docAccess';
import { Stitch } from './Stitch';
import { solidDoc } from './testDocs.test-helper';

describe('beadCode', () => {
  it('with a cell in range, returns its code', () => {
    const code = beadCode(solidDoc(Stitch.Loom, 1, 1), 0, 0);

    expect(code).toBe('DB0001');
  });

  it('with a row outside the doc, throws a RangeError', () => {
    const call = (): unknown => beadCode(solidDoc(Stitch.Loom, 1, 1), 1, 0);

    expect(call).toThrow(RangeError);
  });

  it('with an index past the palette, throws a RangeError', () => {
    const doc = { ...solidDoc(Stitch.Loom, 1, 1), cells: [[5]] };

    const call = (): unknown => beadCode(doc, 0, 0);

    expect(call).toThrow(RangeError);
  });
});
