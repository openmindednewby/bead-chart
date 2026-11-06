import { decodeFigureBitmap, encodeFigureBitmap } from './figureBitmap';

describe('decodeFigureBitmap', () => {
  it('with an encoded bitmap, returns the same pixels', () => {
    const pixels = Array.from({ length: 48 * 48 }, (_, at) => (at % 7 === 0 ? 3 : at % 600 < 300 ? 1 : 0));

    const decoded = decodeFigureBitmap(encodeFigureBitmap(pixels));

    expect(Array.from(decoded)).toEqual(pixels);
  });

  it('with runs that stop short of the square, throws', () => {
    const encoded = encodeFigureBitmap([1, 1, 0]);

    const decode = (): Uint8Array => decodeFigureBitmap(encoded);

    expect(decode).toThrow(RangeError);
  });

  it('with a character outside the alphabet, throws', () => {
    const encoded = '!!';

    const decode = (): Uint8Array => decodeFigureBitmap(encoded, 1);

    expect(decode).toThrow(RangeError);
  });
});
