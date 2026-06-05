import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

const SOURCE_ROOT = fileURLToPath(new URL('./src', import.meta.url))

const withSourceExtension = (path: string) => [
  `${path}.ts`,
  `${path}.tsx`,
  `${path}.js`,
  `${path}.jsx`,
  resolve(path, 'index.ts'),
  resolve(path, 'index.tsx'),
]

const resolveSourceAlias = (path: string) => {
  const sourcePath = resolve(SOURCE_ROOT, path.replace(/^@\//, ''))
  const matchedPath = withSourceExtension(sourcePath).find(existsSync)
  const [resolvedPath = sourcePath] = [matchedPath]

  return resolvedPath
}

type EsbuildPlugin = NonNullable<Options['esbuildPlugins']>[number]

const sourceAliasPlugin: EsbuildPlugin = {
  name: 'source-alias',
  setup(build) {
    build.onResolve({ filter: /^@\// }, (args) => ({
      path: resolveSourceAlias(args.path),
    }))
  },
}

export default defineConfig({
  tsconfig: 'tsconfig.app.json',
  entry: {
    index: 'src/index.ts',
    'area-chart/index': 'src/area-chart/index.ts',
    'bar-chart/index': 'src/bar-chart/index.ts',
    'box-plot/index': 'src/box-plot/index.ts',
    'bullet-chart/index': 'src/bullet-chart/index.ts',
    'funnel-chart/index': 'src/funnel-chart/index.ts',
    'gauge-chart/index': 'src/gauge-chart/index.ts',
    'histogram-chart/index': 'src/histogram-chart/index.ts',
    'kpi-card/index': 'src/kpi-card/index.ts',
    'line-chart/index': 'src/line-chart/index.ts',
    'pie-donut-chart/index': 'src/pie-donut-chart/index.ts',
    'progress-bar/index': 'src/progress-bar/index.ts',
    'ranked-list/index': 'src/ranked-list/index.ts',
    'scatter-plot/index': 'src/scatter-plot/index.ts',
    'sparkline/index': 'src/sparkline/index.ts',
    'variance-chart/index': 'src/variance-chart/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  esbuildPlugins: [sourceAliasPlugin],
  treeshake: {
    moduleSideEffects: false,
  },
  splitting: false,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  noExternal: ['ramda'],
})
