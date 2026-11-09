import { lensBox } from './chartLens';

describe('lensBox', () => {
  it('with a pane scrolled a quarter across a chart four times its size, gives a quarter box a quarter in', () => {
    const pane = { scrollLeft: 100, scrollTop: 0, scrollWidth: 400, scrollHeight: 800, clientWidth: 100, clientHeight: 200 };

    const box = lensBox(pane);

    expect(box).toEqual({ left: '25%', top: '0%', width: '25%', height: '25%' });
  });

  it('with a pane not laid out yet, gives an empty box', () => {
    const pane = { scrollLeft: 0, scrollTop: 0, scrollWidth: 0, scrollHeight: 0, clientWidth: 0, clientHeight: 0 };

    const box = lensBox(pane);

    expect(box).toEqual({ left: '0%', top: '0%', width: '0%', height: '0%' });
  });
});
