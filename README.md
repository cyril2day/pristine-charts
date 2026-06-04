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
```

## Project structure

```txt
src/
  bar-chart/      # bar chart component, domain, and types
  chart-error/    # reusable chart error component
  histogram-chart/ # histogram component, domain, and types
  shared/         # reusable helpers
  styles/         # Sass demo styling
  App.tsx         # demo app shell
```

## Notes

The package is configured for ESM and CJS output, and the public API is intentionally kept small so consumers can import only what they need.
