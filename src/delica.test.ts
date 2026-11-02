import {
  availableDelica,
  DELICA_ATTRIBUTION,
  DELICA_COLOURS,
  findDelica,
  nearestDelica,
} from './delica';

describe('DELICA_COLOURS', () => {
  it('with the shipped data, holds 1,288 colours', () => {
    const count = DELICA_COLOURS.length;

    expect(count).toBe(1288);
  });

  it('with the shipped data, flags 76 as discontinued', () => {
    const flagged = DELICA_COLOURS.filter((colour) => colour.discontinued);

    expect(flagged).toHaveLength(76);
  });

  it('with the shipped data, has unique codes and six-digit hexes', () => {
    const codes = new Set(DELICA_COLOURS.map((colour) => colour.code));

    const badHex = DELICA_COLOURS.filter((colour) => !/^#[0-9A-Fa-f]{6}$/.test(colour.hex));

    expect([codes.size, badHex.length]).toEqual([1288, 0]);
  });
});

describe('DELICA_ATTRIBUTION', () => {
  it('with the shipped constant, names MakeBead and links the CC BY 4.0 licence', () => {
    const { credit, licenceUrl } = DELICA_ATTRIBUTION;

    expect([credit, licenceUrl]).toEqual([
      'Color data: craft-color-codes by MakeBead (https://makebead.com)',
      'https://creativecommons.org/licenses/by/4.0/',
    ]);
  });
});

describe('findDelica', () => {
  it('with a known code, returns the colour', () => {
    const colour = findDelica('DB0001');

    expect(colour?.name).toBe('Metallic Gray');
  });

  it('with a discontinued code, reports it as discontinued', () => {
    const colour = findDelica('DB0551');

    expect(colour?.discontinued).toBe(true);
  });

  it('with an unknown code, returns undefined', () => {
    const colour = findDelica('DB9999');

    expect(colour).toBeUndefined();
  });
});

describe('availableDelica', () => {
  it('with the shipped data, leaves out the discontinued colours', () => {
    const available = availableDelica();

    expect(available).toHaveLength(1212);
  });
});

describe('nearestDelica', () => {
  it('with an exact bead hex, returns that bead', () => {
    const colour = nearestDelica('#2D2E37');

    expect(colour.code).toBe('DB0001');
  });

  it('with the discontinued bead hex, returns a current code', () => {
    const colour = nearestDelica('#B5B0A7');

    expect(colour.discontinued).toBe(false);
  });

  it('with an excluded code, returns the next nearest', () => {
    const colour = nearestDelica('#2D2E37', ['DB0001']);

    expect(colour.code).not.toBe('DB0001');
  });
});
