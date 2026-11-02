import { DEFAULT_LICENCE, isLicenceCode, LICENCE_TERMS } from './licences';
import { LicenceCode } from './LicenceCode';
import { Stitch } from './Stitch';

describe('pinned enum numbers', () => {
  it('with the stored Pattern columns, match them', () => {
    const numbers = [
      Stitch.Peyote,
      Stitch.Brick,
      Stitch.Loom,
      LicenceCode.MakeSellCredit,
      LicenceCode.PersonalOnly,
      LicenceCode.CcBy,
    ];

    expect(numbers).toEqual([1, 2, 3, 1, 2, 3]);
  });
});

describe('DEFAULT_LICENCE', () => {
  it('with D-BEAD-25, is make and sell with credit and refuses chart resale', () => {
    const terms = LICENCE_TERMS[DEFAULT_LICENCE];

    expect([DEFAULT_LICENCE, terms.sellFinishedPieces, terms.creditRequired, terms.resellChart]).toEqual([
      LicenceCode.MakeSellCredit,
      true,
      true,
      false,
    ]);
  });
});

describe('LICENCE_TERMS', () => {
  it('with personal only, refuses selling pieces', () => {
    const terms = LICENCE_TERMS[LicenceCode.PersonalOnly];

    expect(terms.sellFinishedPieces).toBe(false);
  });

  it('with CC BY, allows chart resale with credit', () => {
    const terms = LICENCE_TERMS[LicenceCode.CcBy];

    expect([terms.resellChart, terms.creditRequired]).toEqual([true, true]);
  });
});

describe('isLicenceCode', () => {
  it.each([
    [1, true],
    [3, true],
    [0, false],
    [4, false],
    ['1', false],
  ])('with %j, returns %s', (value, expected) => {
    const result = isLicenceCode(value);

    expect(result).toBe(expected);
  });
});
