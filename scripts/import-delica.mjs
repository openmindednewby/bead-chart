import { readFileSync, writeFileSync } from 'node:fs';

const [source, target] = process.argv.slice(2);
const palette = JSON.parse(readFileSync(source, 'utf8'));
const rows = palette.colors.map(({ code, name, hex, glass, discontinued }) =>
  JSON.stringify({ code, name, hex, glass, ...(discontinued === true ? { discontinued: true } : {}) }),
);
writeFileSync(target, `[\n${rows.join(',\n')}\n]\n`);
