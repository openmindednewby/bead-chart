import golden from './__golden__/geometry.json';
import { geometry } from './geometry';
import { Stitch } from './Stitch';
import { solidDoc } from './testDocs.test-helper';

describe('geometry', () => {
  it('with odd-width peyote, lifts columns 1 and 3 by half a bead', () => {
    const result = geometry(solidDoc(Stitch.Peyote, 5, 2));

    expect(result.positions).toEqual(golden.peyoteOdd5x2);
  });

  it('with even-width peyote, lifts columns 0 and 2 by half a bead', () => {
    const result = geometry(solidDoc(Stitch.Peyote, 4, 2));

    expect(result.positions).toEqual(golden.peyoteEven4x2);
  });

  it('with brick, shifts every second row right by half a bead', () => {
    const result = geometry(solidDoc(Stitch.Brick, 3, 3));

    expect(result.positions).toEqual(golden.brick3x3);
  });

  it('with loom, keeps a square grid', () => {
    const result = geometry(solidDoc(Stitch.Loom, 2, 2));

    expect(result.positions).toEqual(golden.loom2x2);
  });

  it.each([
    [Stitch.Peyote, 5, 2, 5, 2.5],
    [Stitch.Peyote, 1, 2, 1, 2],
    [Stitch.Brick, 3, 3, 3.5, 3],
    [Stitch.Brick, 3, 1, 3, 1],
    [Stitch.Loom, 2, 2, 2, 2],
  ])('with stitch %s at %ix%i, the extent is %d by %d', (stitch, width, height, extentX, extentY) => {
    const result = geometry(solidDoc(stitch, width, height));

    expect([result.extentX, result.extentY]).toEqual([extentX, extentY]);
  });
});
