import {
  BarChart,
  DEFAULT_BAR_CHART_VIEW_PROPS,
} from '@/bar-chart'
import {
  DEFAULT_HISTOGRAM_CHART_VIEW_PROPS,
  HistogramChart,
} from '@/histogram-chart'
import { some } from '@/shared'

const revenueDeltaData = [
  { category: 'North', value: 32 },
  { category: 'South', value: -14 },
  { category: 'East', value: 21 },
  { category: 'West', value: -8 },
  { category: 'Central', value: 18 },
]

const histogramData = [
  45, 52, 61, 61, 63, 67, 70, 71, 72, 74, 75, 76, 78, 80, 82, 85, 88, 91, 94, 99,
]

const barChartProps = {
  ...DEFAULT_BAR_CHART_VIEW_PROPS,
  data: revenueDeltaData,
  ariaLabel: 'Regional revenue delta bar chart',
  caption: some('Regional revenue delta with positive and negative values.'),
  orderStrategy: { kind: 'value', direction: 'descending' },
} satisfies Parameters<typeof BarChart>[0]

const histogramChartProps = {
  ...DEFAULT_HISTOGRAM_CHART_VIEW_PROPS,
  data: histogramData,
  ariaLabel: 'Exam score histogram',
  caption: some('Exam scores grouped by manual thresholds.'),
  binStrategy: { kind: 'manual', thresholds: [40, 50, 60, 70, 80, 90, 100] },
} satisfies Parameters<typeof HistogramChart>[0]

export function ChartsDemoPage() {
  return (
    <main className="app-shell">
      <header className="app-shell__header">
        <p className="app-shell__eyebrow">Pristine Charts</p>
        <h1 className="app-shell__title">Current Charts</h1>
        <p className="app-shell__lead">
          Local examples for the chart components currently exposed by the library.
        </p>
      </header>

      <section className="app-shell__grid">
        <section className="app-shell__panel">
          <h2>Bar Chart</h2>
          <BarChart {...barChartProps} />
        </section>

        <section className="app-shell__panel">
          <h2>Histogram</h2>
          <HistogramChart {...histogramChartProps} />
        </section>
      </section>
    </main>
  )
}
