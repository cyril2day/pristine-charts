# pristine-charts

`pristine-charts` gives you clean, minimal statistical charts with a sensible structure behind them.

## What’s in the repo

- A public npm package for React consumers
- Deep import paths for each chart
- A Vite demo app for local development
- Vitest coverage for chart rendering and domain logic
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
- Type declarations ship alongside the runtime bundles
- `react` and `react-dom` are peer dependencies
- `sideEffects: false` helps bundlers drop unused chart entry points
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

Use the root export when convenience matters, or a deep import when you want the smallest bundle.

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

The root package also exports chart-specific compute, validate, format, and type helpers for people who want to work with the domain layer rather than the components themselves.

### Internal building blocks

Folders like `chart-error`, `demo`, `icons`, `shared`, and the per-chart `components/` directories are part of the codebase, but they are implementation details rather than the main public surface.

## Build outputs

- `pnpm build:lib` writes the npm package artifacts to `dist/`
- `pnpm build:site` writes the demo site to `site-dist/`
- `pnpm build` runs both

## Publishing

- The GitHub Actions workflow in `.github/workflows/release.yml` deploys the site from `main`
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

- The package is meant to be used as a library, not as a single bundled app
- The demo site has its own build output so it can be deployed separately without touching the npm package
