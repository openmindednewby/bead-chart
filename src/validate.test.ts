import doc from './__golden__/peyote-5x4.doc.json';
import { PatternDocIssue } from './PatternDocIssue';
import { assertPatternDoc, MAX_CHART_SIDE, validatePatternDoc } from './validate';

describe('validatePatternDoc', () => {
  it('with the 5x4 doc, has no issues', () => {
    const result = validatePatternDoc(doc);

    expect(result).toEqual({ ok: true, issues: [] });
  });

  it.each([
    ['a string', 'chart', PatternDocIssue.NotAnObject],
    ['null', null, PatternDocIssue.NotAnObject],
    ['a wrong version', { ...doc, version: 2 }, PatternDocIssue.UnsupportedVersion],
    ['an unknown stitch', { ...doc, stitch: 9 }, PatternDocIssue.UnknownStitch],
    ['a zero width', { ...doc, width: 0 }, PatternDocIssue.BadSize],
    ['a height over the limit', { ...doc, height: MAX_CHART_SIDE + 1 }, PatternDocIssue.BadSize],
    ['a fractional width', { ...doc, width: 2.5 }, PatternDocIssue.BadSize],
    ['an empty palette', { ...doc, palette: [] }, PatternDocIssue.BadPalette],
    ['a palette that is not a list', { ...doc, palette: 'DB0001' }, PatternDocIssue.BadPalette],
    ['a duplicate code', { ...doc, palette: ['DB0001', 'DB0001', 'DB0003'] }, PatternDocIssue.BadPalette],
    ['a code outside the list', { ...doc, palette: ['DB0001', 'DB0002', 'DB9999'] }, PatternDocIssue.UnknownCode],
    ['a code that is not text', { ...doc, palette: ['DB0001', 'DB0002', 3] }, PatternDocIssue.UnknownCode],
    ['cells that are not a list', { ...doc, cells: 'x' }, PatternDocIssue.BadCells],
    ['a missing row', { ...doc, cells: doc.cells.slice(1) }, PatternDocIssue.BadCells],
    ['a short row', { ...doc, cells: [[0], ...doc.cells.slice(1)] }, PatternDocIssue.BadCells],
    ['a row that is not a list', { ...doc, cells: ['x', ...doc.cells.slice(1)] }, PatternDocIssue.BadCells],
    ['an index past the palette', { ...doc, cells: [[0, 1, 2, 0, 3], ...doc.cells.slice(1)] }, PatternDocIssue.BadCells],
    ['a negative index', { ...doc, cells: [[0, 1, 2, 0, -1], ...doc.cells.slice(1)] }, PatternDocIssue.BadCells],
  ])('with %s, reports the issue', (_name, value, issue) => {
    const result = validatePatternDoc(value);

    expect(result.ok).toBe(false);
    expect(result.issues).toContain(issue);
  });
});

describe('assertPatternDoc', () => {
  it('with a valid doc, returns it', () => {
    const result = assertPatternDoc(doc);

    expect(result.width).toBe(5);
  });

  it('with an invalid doc, throws naming the issue', () => {
    const call = (): unknown => assertPatternDoc({ ...doc, stitch: 9 });

    expect(call).toThrow('Invalid PatternDoc: unknown-stitch');
  });
});
