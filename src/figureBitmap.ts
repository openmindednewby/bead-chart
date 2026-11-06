const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const LOOKUP = new Map([...ALPHABET].map((char, index) => [char, index]));
const RUN_SPAN = 512;
const TOKEN_BITS = 6;
const TOKEN_MASK = 63;

export const FIGURE_SOURCE_SIZE = 48;

function digit(char: string): number {
  const value = LOOKUP.get(char);
  if (value === undefined) {
    throw new RangeError(`Figure bitmap holds an unknown character: ${char}`);
  }
  return value;
}

/** Decodes run-length figure pixels into one value per pixel, row by row from the top. */
export function decodeFigureBitmap(encoded: string, size: number = FIGURE_SOURCE_SIZE): Uint8Array {
  const pixels = new Uint8Array(size * size);
  let at = 0;
  for (let index = 0; index + 1 < encoded.length; index += 2) {
    const token = (digit(encoded.charAt(index)) << TOKEN_BITS) | digit(encoded.charAt(index + 1));
    const run = (token % RUN_SPAN) + 1;
    pixels.fill(Math.floor(token / RUN_SPAN), at, at + run);
    at += run;
  }
  if (at !== pixels.length) {
    throw new RangeError('Figure bitmap does not fill its square');
  }
  return pixels;
}

/** Encodes pixel values 0-7 as two-character runs, the format of the generated catalogue. */
export function encodeFigureBitmap(pixels: ArrayLike<number>): string {
  const tokens: string[] = [];
  let index = 0;
  while (index < pixels.length) {
    const value = pixels[index] ?? 0;
    let run = 1;
    while (index + run < pixels.length && pixels[index + run] === value && run < RUN_SPAN) {
      run += 1;
    }
    const token = value * RUN_SPAN + run - 1;
    tokens.push(ALPHABET.charAt(token >> TOKEN_BITS) + ALPHABET.charAt(token & TOKEN_MASK));
    index += run;
  }
  return tokens.join('');
}
