import type { HarmonyCount } from '@dloizides/color-science';

import type { MotifKind } from '../../MotifKind';
import type { MotifParams } from '../../types';

export type PresetRow = readonly [
  id: string,
  name: string,
  kind: MotifKind,
  colourCount: HarmonyCount,
  params: MotifParams,
  period: number,
];
