# @dloizides/bead-chart

One thread-path rule for Jinx Bead Patterns. The picture, word chart, counts and animation all read `threadPath`, so they cannot disagree. No DOM, no React, no Node built-ins.

```ts
import { generateMotif, MotifKind, renderChartSvg, Stitch, wordChart } from '@dloizides/bead-chart';

const doc = generateMotif({
  stitch: Stitch.Peyote,
  width: 12,
  height: 20,
  seed: 42,
  kind: MotifKind.Diamond,
  colourCount: 3,
});
wordChart(doc);
renderChartSvg(doc, { label: 'Diamond bracelet chart' });
```

## API

| Function | Does |
|---|---|
| `validatePatternDoc`, `assertPatternDoc` | Checks untrusted JSON: shape, at most 400x400, every code in the Delica list |
| `geometry`, `beadPosition` | Bead positions in bead units, y grows upward from the first worked row |
| `threadPath`, `stitchOrder` | Woven rows and beads in thread order |
| `wovenRowCount` | The last row number a beader reads. Peyote: 2 x `height`, so a 48-high chart is 96 woven rows. Brick and loom: `height`. Use it wherever a total is shown; `height` counts grid rows |
| `wordChart` | Per woven row: row numbers, direction, colour runs |
| `beadCounts`, `shoppingList` | Beads per colour, most used first; the list adds name, hex, discontinued |
| `renderChartSvg` | SVG string, beads drawn in stitch order. `firstRow: 'top'` (default) puts row 1 on the top edge with numbers growing down; `'bottom'` mirrors it. Validates first; only numbers, codes from the list and an escaped label reach the markup |
| `generateMotif`, `MOTIF_KINDS` | Plain config to doc. Same config, same doc. Uses `harmony` from `@dloizides/color-science`, current beads only |
| `recolour`, `recolourToPalette` | New doc, same geometry. Colours mapped to one code merge |
| `DELICA_COLOURS`, `findDelica`, `requireDelica`, `availableDelica`, `nearestDelica`, `DELICA_ATTRIBUTION` | The colour list and its credit line |
| `LICENCE_TERMS`, `DEFAULT_LICENCE`, `isLicenceCode`, `LicenceCode` | Three stored codes and what each permits. Display wording stays in the app and awaits a legal check (D-BEAD-25 "Default licence is make and sell, with credit") |

## The chart model

`width` x `height` is the picture: `cells[row][col]`, `cells[0]` first worked, `width * height` beads in total. `Stitch`, `LicenceCode` numbers are stored by the API and pinned.

| Stitch | Offset | Thread |
|---|---|---|
| Peyote | Columns with the parity of `width - 1` sit low, the others half a bead higher | Grid row 0 is strung left to right as rows 1 and 2. Each later grid row is two woven rows: right to left through the low columns, then left to right through the high ones |
| Brick | Odd grid rows shift half a bead right | One row per grid row, turning at each end |
| Loom | None | Every row picked up left to right |

Peyote at width 5: rows 1 and 2 take 5 beads, then rows alternate 3 and 2. At width 6: 6, then 3 and 3. Odd width needs the turn at the left edge of every odd row after row 1; the word chart gives beads, not the turn.

## Golden files

`src/__golden__` was worked out by hand from the rule above before the code existed. Claude wrote them, so they are not outside proof: no beader has checked them against a physical piece. Tests also assert two physical properties of peyote: each added bead sits in a gap of the row below, and a row turn moves one column.

## Delica data and licence

Code: MIT. `src/data/delica.json`: [CC BY 4.0](LICENSE-DATA.md), so every product showing these colours credits it:

> Color data: craft-color-codes by MakeBead (https://makebead.com)

Taken from https://github.com/makebead/craft-color-codes at commit `84dbdc26`, by `scripts/import-delica.mjs`. Changes: dropped `rgb`; `discontinued` set on every colour. MakeBead derives each hex from Miyuki's product photo, so it names the right bead at an approximate shade, and metallic or AB finishes cannot be one flat colour.

## Figures

```ts
import { figureToChart, Stitch } from '@dloizides/bead-chart';
import { loadFigure, loadFigureIndex, searchFigures } from '@dloizides/bead-chart/figures';

const [fox] = searchFigures(await loadFigureIndex(), 'fox');
const source = fox && (await loadFigure(fox));
const chart = source && figureToChart(source, { stitch: Stitch.Peyote, width: 40 });
```

21,144 figures from Noto fonts (OFL-1.1) and Noto Emoji (Apache-2.0), names from Unicode CLDR (Unicode-3.0); see `NOTICE` and `LICENSES/`. Regenerate with `python scripts/figures/build_catalogue.py <cache> src/figures/generated LICENSES <noto-emoji clone>`.
