import type { MotifCell } from './motifRules';

const PEAK_STEPS = 3;
const HOUNDSTOOTH_SIDE = 8;
const HOUNDSTOOTH = ''.concat(
  '11110001',
  '11110011',
  '11110111',
  '11111110',
  '01110000',
  '00110000',
  '00010000',
  '10000000',
);
const HEART_SCALE = 0.8;
const HEART_LIFT = 0.2;
const HEART_PAD = 3;

function triangleWave(value: number, period: number): number {
  return Math.abs((value % (2 * period)) - period);
}

function centred(value: number, side: number): number {
  return Math.abs((value % side) - (side - 1) / 2);
}

export function waves(cell: MotifCell): number {
  const lift = cell.period * (1 + Math.sin((cell.x * Math.PI) / (2 * cell.period)));
  return Math.floor((cell.y + lift) / cell.period);
}

export function steppedPeaks(cell: MotifCell): number {
  const step = Math.floor(cell.x / cell.period) % (2 * PEAK_STEPS);
  return Math.floor(cell.y / cell.period) + Math.abs(step - PEAK_STEPS);
}

export function flame(cell: MotifCell): number {
  const height = triangleWave(cell.x, cell.period) + triangleWave(cell.x, 2 * cell.period);
  return Math.floor((cell.y + height) / cell.period);
}

export function houndstooth(cell: MotifCell): number {
  const unit = Math.max(1, Math.floor(cell.period / 2));
  const row = Math.floor(cell.y / unit) % HOUNDSTOOTH_SIDE;
  const column = Math.floor(cell.x / unit) % HOUNDSTOOTH_SIDE;
  return HOUNDSTOOTH.charAt(row * HOUNDSTOOTH_SIDE + column) === '1' ? 1 : 0;
}

export function argyle(cell: MotifCell): number {
  const side = 2 * cell.period;
  const onLine = (cell.x + cell.y) % side === 0 || (((cell.x - cell.y) % side) + side) % side === 0;
  if (onLine) {
    return 2;
  }
  return triangleWave(cell.x, side) + triangleWave(cell.y, side) < side ? 1 : 0;
}

export function herringbone(cell: MotifCell): number {
  const offset = cell.x % cell.period;
  const slant = Math.floor(cell.x / cell.period) % 2 === 0 ? offset : cell.period - 1 - offset;
  return Math.floor((cell.y + slant) / cell.period);
}

export function triangles(cell: MotifCell): number {
  const split = cell.x % cell.period > cell.y % cell.period ? 1 : 0;
  return Math.floor(cell.y / cell.period) + split;
}

export function twist(cell: MotifCell): number {
  return Math.floor((cell.x + cell.y) / cell.period);
}

export function oxo(cell: MotifCell): number {
  const side = 2 * cell.period + 2;
  const across = centred(cell.x, side);
  const down = centred(cell.y, side);
  const isRing = Math.floor(cell.x / side) % 2 === 0;
  const onFigure = isRing ? across + down === cell.period : across === down;
  return onFigure ? 1 : 0;
}

export function crosses(cell: MotifCell): number {
  const side = 2 * cell.period;
  const across = cell.x % side;
  const down = cell.y % side;
  const arm = Math.max(1, Math.floor(cell.period / 2));
  const onBar = across === cell.period && Math.abs(down - cell.period) <= arm;
  const onBeam = down === cell.period && Math.abs(across - cell.period) <= arm;
  return onBar || onBeam ? 1 : 0;
}

export function stars(cell: MotifCell): number {
  const side = 2 * cell.period + 1;
  const across = Math.abs((cell.x % side) - cell.period);
  const down = Math.abs((cell.y % side) - cell.period);
  const onRay = across === 0 || down === 0 || across === down;
  if (!onRay || Math.max(across, down) >= cell.period) {
    return 0;
  }
  return across + down === 0 ? 2 : 1;
}

export function hearts(cell: MotifCell): number {
  const side = 2 * cell.period + HEART_PAD;
  const radius = (side / 2) * HEART_SCALE;
  const u = ((cell.x % side) + 0.5 - side / 2) / radius;
  const v = (side / 2 - (cell.y % side) - 0.5) / radius + HEART_LIFT;
  const curve = (u * u + v * v - 1) ** 3 - u * u * v ** 3;
  return curve <= 0 ? 1 : 0;
}
