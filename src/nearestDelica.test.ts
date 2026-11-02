import { availableDelica, nearestDelica, requireDelica } from './delica';

describe('nearestDelica', () => {
  it('with every code excluded, throws a RangeError', () => {
    const everyCode = availableDelica().map((colour) => colour.code);

    const call = (): unknown => nearestDelica('#000000', everyCode);

    expect(call).toThrow(RangeError);
  });
});

describe('requireDelica', () => {
  it('with a known code, returns the colour', () => {
    const colour = requireDelica('DB0001');

    expect(colour.code).toBe('DB0001');
  });
});
