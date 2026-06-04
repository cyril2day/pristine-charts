import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'bar-chart/index': 'src/bar-chart/index.ts',
    'histogram-chart/index': 'src/histogram-chart/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  treeshake: {
    moduleSideEffects: false,
  },
  splitting: false,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  noExternal: ['ramda'],
})
