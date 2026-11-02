import { LicenceCode } from './LicenceCode';
import type { LicenceTerms } from './types';

export const DEFAULT_LICENCE = LicenceCode.MakeSellCredit;

export const LICENCE_TERMS: Readonly<Record<LicenceCode, LicenceTerms>> = {
  [LicenceCode.MakeSellCredit]: { sellFinishedPieces: true, creditRequired: true, resellChart: false },
  [LicenceCode.PersonalOnly]: { sellFinishedPieces: false, creditRequired: false, resellChart: false },
  [LicenceCode.CcBy]: { sellFinishedPieces: true, creditRequired: true, resellChart: true },
};

/** True for the three stored licence numbers. */
export function isLicenceCode(value: unknown): value is LicenceCode {
  return (
    value === LicenceCode.MakeSellCredit ||
    value === LicenceCode.PersonalOnly ||
    value === LicenceCode.CcBy
  );
}
