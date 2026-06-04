import {
  AreaChart,
  DEFAULT_AREA_CHART_VIEW_PROPS,
} from '@/area-chart'
import {
  BarChart,
  DEFAULT_BAR_CHART_VIEW_PROPS,
} from '@/bar-chart'
import {
  BoxPlot,
  DEFAULT_BOX_PLOT_VIEW_PROPS,
} from '@/box-plot'
import {
  DEFAULT_HISTOGRAM_CHART_VIEW_PROPS,
  HistogramChart,
} from '@/histogram-chart'
import {
  DEFAULT_LINE_CHART_VIEW_PROPS,
  LineChart,
} from '@/line-chart'
import {
  DEFAULT_PIE_DONUT_CHART_VIEW_PROPS,
  PieDonutChart,
} from '@/pie-donut-chart'
import {
  DEFAULT_SCATTER_PLOT_VIEW_PROPS,
  ScatterPlot,
} from '@/scatter-plot'
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

const boxPlotData = [
  12, 45, 52, 55, 61, 63, 67, 70, 71, 72, 74, 75, 76, 78, 80, 82, 85, 88, 91, 99,
]

const weeklyTemperatureData = [
  { x: 1, y: 22 },
  { x: 2, y: 24 },
  { x: 3, y: 19 },
  { x: 4, y: 21 },
  { x: 5, y: 25 },
  { x: 6, y: 28 },
  { x: 7, y: 26 },
]

const weeklyActiveUsersData = [
  { x: 1, y: 1200 },
  { x: 2, y: 1500 },
  { x: 3, y: 1350 },
  { x: 4, y: 1800 },
  { x: 5, y: 2100 },
  { x: 6, y: 1950 },
  { x: 7, y: 1600 },
]

const budgetBreakdownData = [
  { category: 'Engineering', value: 450000 },
  { category: 'Marketing', value: 200000 },
  { category: 'Operations', value: 150000 },
  { category: 'HR', value: 100000 },
  { category: 'Legal', value: 50000 },
]

const studyScoreData = [
  { x: 2, y: 55 },
  { x: 3, y: 60 },
  { x: 5, y: 72 },
  { x: 5, y: 68 },
  { x: 8, y: 85 },
  { x: 8, y: 91 },
  { x: 10, y: 88 },
  { x: 1, y: 40 },
  { x: 6, y: 75 },
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

const boxPlotProps = {
  ...DEFAULT_BOX_PLOT_VIEW_PROPS,
  data: boxPlotData,
  ariaLabel: 'Exam score box plot',
  caption: some('Exam score distribution with one low outlier.'),
} satisfies Parameters<typeof BoxPlot>[0]

const lineChartProps = {
  ...DEFAULT_LINE_CHART_VIEW_PROPS,
  data: weeklyTemperatureData,
  ariaLabel: 'Weekly temperature line chart',
  caption: some('Daily temperature readings ordered by numeric weekday.'),
} satisfies Parameters<typeof LineChart>[0]

const areaChartProps = {
  ...DEFAULT_AREA_CHART_VIEW_PROPS,
  data: weeklyActiveUsersData,
  ariaLabel: 'Weekly active users area chart',
  caption: some('Daily active users with the filled region anchored to zero.'),
} satisfies Parameters<typeof AreaChart>[0]

const pieDonutChartProps = {
  ...DEFAULT_PIE_DONUT_CHART_VIEW_PROPS,
  data: budgetBreakdownData,
  ariaLabel: 'Department budget donut chart',
  caption: some('Annual budget share by department.'),
  variant: some({ kind: 'donut', innerRadius: 0.54 }),
  formatValue: (value: number) => `$${value.toLocaleString()}`,
} satisfies Parameters<typeof PieDonutChart>[0]

const scatterPlotProps = {
  ...DEFAULT_SCATTER_PLOT_VIEW_PROPS,
  data: studyScoreData,
  ariaLabel: 'Study hours and exam score scatter plot',
  caption: some('Student study hours plotted against exam score.'),
} satisfies Parameters<typeof ScatterPlot>[0]

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

        <section className="app-shell__panel">
          <h2>Box Plot</h2>
          <BoxPlot {...boxPlotProps} />
        </section>

        <section className="app-shell__panel">
          <h2>Line Chart</h2>
          <LineChart {...lineChartProps} />
        </section>

        <section className="app-shell__panel">
          <h2>Area Chart</h2>
          <AreaChart {...areaChartProps} />
        </section>

        <section className="app-shell__panel">
          <h2>Pie / Donut Chart</h2>
          <PieDonutChart {...pieDonutChartProps} />
        </section>

        <section className="app-shell__panel">
          <h2>Scatter Plot</h2>
          <ScatterPlot {...scatterPlotProps} />
        </section>
      </section>
    </main>
  )
}
