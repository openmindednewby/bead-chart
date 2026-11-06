import { readdirSync } from 'fs';
import { basename } from 'path';
import { defineConfig, type Options } from 'tsup';
import type { Plugin } from 'esbuild';

const GENERATED_DIR = 'src/figures/generated';
const FIGURE_DATA = /^(chunk\d+|figureIndex)\.ts$/;
const FIGURE_DATA_IMPORT = /^\.\/(generated\/)?(chunk\d+|figureIndex)$/;

const figureDataEntries = Object.fromEntries(
  readdirSync(GENERATED_DIR)
    .filter((file) => FIGURE_DATA.test(file))
    .map((file) => [`figure-data/${basename(file, '.ts')}`, `${GENERATED_DIR}/${file}`]),
);

const requireFigureData: Plugin = {
  name: 'require-figure-data',
  setup(build) {
    build.onResolve({ filter: FIGURE_DATA_IMPORT }, (args) =>
      args.kind === 'dynamic-import' ? { path: `./figure-data/${basename(args.path)}.js`, external: true } : undefined,
    );
  },
};

const shared: Options = {
  dts: true,
  sourcemap: false,
  clean: false,
  treeshake: true,
  minify: false,
  target: 'es2020',
  outDir: 'dist',
  external: [],
};

export default defineConfig([
  {
    ...shared,
    entry: { index: 'src/index.ts', figures: 'src/figures/index.ts' },
    format: ['esm'],
    splitting: true,
  },
  {
    ...shared,
    entry: { index: 'src/index.ts', figures: 'src/figures/index.ts' },
    format: ['cjs'],
    splitting: false,
    esbuildPlugins: [requireFigureData],
    esbuildOptions(options) {
      options.supported = { ...options.supported, 'dynamic-import': false };
    },
  },
  {
    ...shared,
    dts: false,
    entry: figureDataEntries,
    format: ['cjs'],
    splitting: false,
  },
]);
