# pristine-charts

`pristine-charts` is a small React chart library with tree-shakeable deep imports, a demo app, and separate build outputs for npm and GitHub Pages.

## What’s in the repo

- A public npm library entry for React consumers
- Deep import paths for each chart
- A Vite demo app for local development and GitHub Pages
- Vitest coverage for chart rendering and domain rules
- TypeScript declarations in the published package

## Supported charts

- Area chart
- Bar chart
- Box plot
- Bullet chart
- Histogram chart
- KPI card
- Line chart
- Pie / donut chart
- Progress bar
- Ranked list
- Scatter plot
- Sparkline

## Package shape

- ESM and CJS builds are published from `dist/`
- Type declarations are published alongside the runtime bundles
- `react` and `react-dom` are peer dependencies
- `sideEffects: false` is set to help bundlers tree-shake unused chart entry points
- Each chart can be imported from the root package or from its own subpath

## Install

```sh
pnpm install
```

## Run locally

```sh
pnpm dev
```

## Scripts

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build:lib
pnpm build:site
pnpm build
```

## Library usage

Use the root export when convenience matters, or a deep import when you want the smallest possible bundle.

```tsx
import { BarChart } from 'pristine-charts'

export function Example() {
  return (
    <BarChart
      data={[
        { category: 'North', value: 32 },
        { category: 'South', value: -14 },
      ]}
    />
  )
}
```

```tsx
import { BarChart } from 'pristine-charts/bar-chart'
import { HistogramChart } from 'pristine-charts/histogram-chart'
import { KPICard } from 'pristine-charts/kpi-card'
import { LineChart } from 'pristine-charts/line-chart'
import { AreaChart } from 'pristine-charts/area-chart'
import { ScatterPlot } from 'pristine-charts/scatter-plot'
import { Sparkline } from 'pristine-charts/sparkline'
```

## Public API

### Chart components

These are the primary components intended for direct use:

- `AreaChart`
- `BarChart`
- `BoxPlot`
- `BulletChart`
- `HistogramChart`
- `KPICard`
- `LineChart`
- `PieDonutChart`
- `ProgressBar`
- `RankedList`
- `ScatterPlot`
- `Sparkline`

### Helpers and types

The root package also exports chart-specific compute, validate, format, and type helpers for consumers who want to build on the domain layer instead of rendering the components directly.

### Internal building blocks

Folders like `chart-error`, `demo`, `icons`, `shared`, and the per-chart `components/` directories are part of the repo, but they are implementation details rather than the main public usage surface.

## Build outputs

- `pnpm build:lib` writes the npm package artifacts to `dist/`
- `pnpm build:site` writes the demo site to `site-dist/`
- `pnpm build` runs both

## Publishing

- The GitHub Actions workflow in `.github/workflows/release.yml` deploys the demo site from `main`
- The same workflow publishes to npm from `v*` tags
- npm publishing expects an `NPM_TOKEN` secret in GitHub

## Project structure

```txt
src/
  area-chart/        # area chart component, domain, and types
  bar-chart/         # bar chart component, domain, and types
  box-plot/          # box plot component, domain, and types
  bullet-chart/      # bullet chart component, domain, and types
  chart-error/       # reusable chart error component
  histogram-chart/   # histogram component, domain, and types
  kpi-card/          # KPI card component, domain, and types
  line-chart/        # line chart component, domain, and types
  pie-donut-chart/   # pie and donut chart component, domain, and types
  progress-bar/      # progress bar component, domain, and types
  ranked-list/       # ranked list component, domain, and types
  scatter-plot/      # scatter plot component, domain, and types
  sparkline/         # sparkline component, domain, and types
  shared/            # reusable helpers
  styles/            # demo styling
  demo/              # demo-page components
  App.tsx            # demo app shell
  main.tsx           # demo app entry point
```

## Notes

- The package is designed to be consumed as a library, not as a monolithic app bundle
- The demo site uses its own static build path so it can be deployed to GitHub Pages without affecting the npm package output
