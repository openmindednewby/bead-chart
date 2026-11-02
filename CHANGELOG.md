# Changelog

## 0.2.0 - 2026-11-02

- `renderChartSvg` takes `firstRow: 'top' | 'bottom'`. The default is now `'top'`, so row 1 draws on the top edge; 0.1.0 drew it at the bottom. Pass `'bottom'` for the old picture. `geometry` is unchanged: y still grows from the first worked row.
- New `wovenRowCount(doc)`: the last row number a beader reads, 2 x `height` for peyote, `height` for brick and loom.

## 0.1.0 - 2026-11-02

- First release, for BEAD-1 "Bead pattern app". `PatternDoc` schema and validator, peyote, brick and loom geometry, `threadPath`, `stitchOrder`, `wordChart`, `beadCounts`, `shoppingList`, `renderChartSvg`, 1,288 Miyuki Delica colours (76 discontinued) with attribution, `generateMotif`, `recolour`, `recolourToPalette`, licence codes.
