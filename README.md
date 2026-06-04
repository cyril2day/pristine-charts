# pristine-charts

A small tree-shakeable React component library built with Vite, TypeScript, D3, Ramda, and Sass.

## What this project contains

- A public library entry for React consumers
- Deep import paths for individual chart components
- A demo app for local development and visual checks
- Vitest coverage for chart rendering and domain rules

## Features

- Tree-shakeable package exports
- React-only rendering for UI elements
- D3-based chart calculations
- Typed validation for chart domain errors
- Ramda utilities for composable data handling
- Sass styling support through pristine-styles

## Installation

```sh
pnpm install
```

## Local development

```sh
pnpm dev
```

## Available scripts

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Library usage

Root export:

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

Deep export:

```tsx
import { BarChart } from 'pristine-charts/bar-chart'
import { HistogramChart } from 'pristine-charts/histogram-chart'
import { KPICard } from 'pristine-charts/kpi-card'
import { LineChart } from 'pristine-charts/line-chart'
import { AreaChart } from 'pristine-charts/area-chart'
import { ScatterPlot } from 'pristine-charts/scatter-plot'
import { Sparkline } from 'pristine-charts/sparkline'
```

## Project structure

```txt
src/
  area-chart/     # area chart component, domain, and types
  bar-chart/      # bar chart component, domain, and types
  chart-error/    # reusable chart error component
  histogram-chart/ # histogram component, domain, and types
  kpi-card/       # KPI card component, domain, and types
  line-chart/     # line chart component, domain, and types
  scatter-plot/   # scatter plot component, domain, and types
  sparkline/      # sparkline component, domain, and types
  shared/         # reusable helpers
  styles/         # Sass demo styling
  App.tsx         # demo app shell
```

## Notes

The package is configured for ESM and CJS output, and the public API is intentionally kept small so consumers can import only what they need.
