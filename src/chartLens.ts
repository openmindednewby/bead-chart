const PERCENT = 100;

export interface ScrollBox {
  readonly scrollLeft: number;
  readonly scrollTop: number;
  readonly scrollWidth: number;
  readonly scrollHeight: number;
  readonly clientWidth: number;
  readonly clientHeight: number;
}

type Percent = `${number}%`;

export interface LensBox {
  readonly left: Percent;
  readonly top: Percent;
  readonly width: Percent;
  readonly height: Percent;
}

function percentOf(part: number, whole: number): Percent {
  return whole > 0 ? `${Math.min(PERCENT, (part / whole) * PERCENT)}%` : '0%';
}

/** Where a scrolled zoom pane's view sits on the chart, as a box in percent of the chart. */
export function lensBox(pane: ScrollBox): LensBox {
  return {
    left: percentOf(pane.scrollLeft, pane.scrollWidth),
    top: percentOf(pane.scrollTop, pane.scrollHeight),
    width: percentOf(pane.clientWidth, pane.scrollWidth),
    height: percentOf(pane.clientHeight, pane.scrollHeight),
  };
}
