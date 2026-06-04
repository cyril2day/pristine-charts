# pristine-charts

A small tree-shakeable React component library built with Vite, TypeScript, D3, Ramda, and Sass.

## What this project contains

- A public library entry for React consumers
- A deep import path for the chart component
- A demo app for local development and visual checks
- Vitest coverage for the chart component

## Features

- Tree-shakeable package exports
- React-only rendering for UI elements
- D3-based chart calculations
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

```ts
import { BarChart } from 'pristine-charts'
```

Deep export:

```ts
import { BarChart } from 'pristine-charts/bar-chart'
```

## Project structure

```txt
src/
  bar-chart/      # chart component and types
  shared/         # reusable helpers
  styles/         # Sass demo styling
  App.tsx         # demo app shell
```

## Notes

The package is configured for ESM and CJS output, and the public API is intentionally kept small so consumers can import only what they need.
