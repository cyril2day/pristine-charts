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
  BulletChart,
  DEFAULT_BULLET_CHART_VIEW_PROPS,
} from '@/bullet-chart'
import {
  DEFAULT_FUNNEL_CHART_VIEW_PROPS,
  FunnelChart,
} from '@/funnel-chart'
import {
  DEFAULT_GAUGE_CHART_VIEW_PROPS,
  GaugeChart,
} from '@/gauge-chart'
import {
  DEFAULT_HISTOGRAM_CHART_VIEW_PROPS,
  HistogramChart,
} from '@/histogram-chart'
import {
  DEFAULT_KPI_CARD_VIEW_PROPS,
  KPICard,
} from '@/kpi-card'
import {
  DEFAULT_LINE_CHART_VIEW_PROPS,
  LineChart,
} from '@/line-chart'
import {
  DEFAULT_PIE_DONUT_CHART_VIEW_PROPS,
  PieDonutChart,
} from '@/pie-donut-chart'
import {
  DEFAULT_PROGRESS_BAR_VIEW_PROPS,
  ProgressBar,
} from '@/progress-bar'
import {
  DEFAULT_RANKED_LIST_VIEW_PROPS,
  RankedList,
} from '@/ranked-list'
import {
  DEFAULT_SCATTER_PLOT_VIEW_PROPS,
  ScatterPlot,
} from '@/scatter-plot'
import {
  DEFAULT_SPARKLINE_VIEW_PROPS,
  Sparkline,
} from '@/sparkline'
import {
  DEFAULT_VARIANCE_CHART_VIEW_PROPS,
  VARIANCE_LOWER_IS_BETTER,
  VarianceChart,
} from '@/variance-chart'
import {
  none,
  some,
} from '@/shared'
import {
  always,
  cond,
  ifElse,
} from '@/shared/fp'

import type {
  ChartDemo,
  ChartDemoDataShape,
  ChartDemoDataShapeColumn,
  ChartDemoState,
  EditableRow,
  EditableValue,
  RowField,
} from './ChartDemo.types'

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

const monthlyRevenueTrendData = [
  { x: 1, y: 92_000 },
  { x: 2, y: 95_500 },
  { x: 3, y: 91_200 },
  { x: 4, y: 104_800 },
  { x: 5, y: 110_100 },
  { x: 6, y: 108_700 },
  { x: 7, y: 116_400 },
  { x: 8, y: 121_300 },
]

const budgetBreakdownData = [
  { category: 'Engineering', value: 450000 },
  { category: 'Marketing', value: 200000 },
  { category: 'Operations', value: 150000 },
  { category: 'HR', value: 100000 },
  { category: 'Legal', value: 50000 },
]

const salesFunnelData = [
  { stage: 'Leads', value: 1200 },
  { stage: 'Qualified', value: 780 },
  { stage: 'Proposal', value: 360 },
  { stage: 'Negotiation', value: 180 },
  { stage: 'Closed Won', value: 72 },
]

const regionalSalesRankingsData = [
  { label: 'North', value: 340000, priorRank: 3 },
  { label: 'East', value: 290000, priorRank: 1 },
  { label: 'South', value: 210000, priorRank: 3 },
  { label: 'West', value: 180000, priorRank: 5 },
  { label: 'Central', value: 165000, priorRank: 4 },
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

const departmentalCostVarianceData = [
  { category: 'Marketing', actualValue: 112_000, budgetValue: 100_000 },
  { category: 'Operations', actualValue: 92_000, budgetValue: 100_000 },
  { category: 'HR', actualValue: 50_000, budgetValue: 50_000 },
  { category: 'Support', actualValue: 73_000, budgetValue: 68_000 },
  { category: 'Legal', actualValue: 41_000, budgetValue: 48_000 },
]

const performanceBands = [
  { label: 'At risk', lowerBound: 0, upperBound: 60_000 },
  { label: 'Watch', lowerBound: 60_000, upperBound: 80_000 },
  { label: 'Healthy', lowerBound: 80_000, upperBound: 120_000 },
]

const performanceZones = [
  { label: 'At risk', lowerBound: 0, upperBound: 45 },
  { label: 'Watch', lowerBound: 45, upperBound: 70 },
  { label: 'Healthy', lowerBound: 70, upperBound: 100 },
]

const formatSignedCurrency = (value: number) => {
  const sign = cond([
    [(candidate: number) => candidate > 0, () => '+'],
    [(candidate: number) => candidate < 0, () => '-'],
    [() => true, () => ''],
  ])(value)

  return `${sign}$${Math.abs(value).toLocaleString()}`
}

const isNumberValue = (value: EditableValue) => typeof value === 'number'
const isBlankString = (value: string) => value.trim().length === 0
const isBlankEditableValue = (value: EditableValue) => isBlankString(String(value))

const toNumber = cond([
  [isNumberValue, (value: EditableValue) => Number(value)],
  [isBlankEditableValue, always(Number.NaN)],
  [always(true), (value: EditableValue) => Number(value)],
])

const asString = (value: EditableValue) => String(value)

const numericRows = (data: readonly number[]) =>
  data.map((value) => ({ value }))

const pointRows = (data: readonly { readonly x: number, readonly y: number }[]) =>
  data.map(({ x, y }) => ({ x, y }))

const categoryRows = (data: readonly { readonly category: string, readonly value: number }[]) =>
  data.map(({ category, value }) => ({ category, value }))

const stageRows = (data: readonly { readonly stage: string, readonly value: number }[]) =>
  data.map(({ stage, value }) => ({ stage, value }))

const toNumericDataset = (rows: readonly EditableRow[]) =>
  rows.map((row) => toNumber(row.value))

const toPointDataset = (rows: readonly EditableRow[]) =>
  rows.map((row) => ({
    x: toNumber(row.x),
    y: toNumber(row.y),
  }))

const toCategoryDataset = (rows: readonly EditableRow[]) =>
  rows.map((row) => ({
    category: asString(row.category),
    value: toNumber(row.value),
  }))

const toStageDataset = (rows: readonly EditableRow[]) =>
  rows.map((row) => ({
    stage: asString(row.stage),
    value: toNumber(row.value),
  }))

const toBands = (rows: readonly EditableRow[]) =>
  rows.map((row) => ({
    label: asString(row.label),
    lowerBound: toNumber(row.lowerBound),
    upperBound: toNumber(row.upperBound),
  }))

const toRankedItems = (rows: readonly EditableRow[]) =>
  rows.map((row) => {
    const priorRank = toNumber(row.priorRank)
    const toPriorRank = ifElse(
      (value: number) => Number.isNaN(value),
      always(none),
      (value: number) => some(value),
    )

    return {
      label: asString(row.label),
      value: toNumber(row.value),
      priorRank: toPriorRank(priorRank),
    }
  })

export const createInitialDemoState = (): ChartDemoState => ({
  barData: categoryRows(revenueDeltaData),
  histogramData: numericRows(histogramData),
  boxPlotData: numericRows(boxPlotData),
  lineData: pointRows(weeklyTemperatureData),
  areaData: pointRows(weeklyActiveUsersData),
  sparklineData: pointRows(monthlyRevenueTrendData),
  pieDonutData: categoryRows(budgetBreakdownData),
  funnelData: stageRows(salesFunnelData),
  scatterData: pointRows(studyScoreData),
  varianceData: departmentalCostVarianceData.map(({ category, actualValue, budgetValue }) => ({
    category,
    actualValue,
    budgetValue,
  })),
  progressCurrentValue: 73_000,
  progressTotal: 100_000,
  bulletCurrentValue: 87_000,
  bulletTargetValue: 100_000,
  bulletBands: performanceBands,
  gaugeCurrentValue: 32,
  gaugeMinimum: 0,
  gaugeMaximum: 100,
  gaugeZones: performanceZones,
  rankedListData: regionalSalesRankingsData,
  kpiMetricName: 'Monthly Revenue',
  kpiCurrentValue: 124_500,
  kpiReferenceValue: 110_800,
})

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

const sparklineProps = {
  ...DEFAULT_SPARKLINE_VIEW_PROPS,
  data: monthlyRevenueTrendData,
  ariaLabel: 'Monthly revenue trend sparkline',
  caption: some('Eight-month revenue trend shown as a compact inline chart.'),
} satisfies Parameters<typeof Sparkline>[0]

const pieDonutChartProps = {
  ...DEFAULT_PIE_DONUT_CHART_VIEW_PROPS,
  data: budgetBreakdownData,
  ariaLabel: 'Department budget donut chart',
  caption: some('Annual budget share by department.'),
  variant: some({ kind: 'donut', innerRadius: 0.54 }),
  formatValue: (value: number) => `$${value.toLocaleString()}`,
} satisfies Parameters<typeof PieDonutChart>[0]

const funnelChartProps = {
  ...DEFAULT_FUNNEL_CHART_VIEW_PROPS,
  data: salesFunnelData,
  ariaLabel: 'Sales pipeline funnel chart',
  caption: some('Sales pipeline stage conversion from lead to closed won.'),
  formatValue: (value: number) => value.toLocaleString(),
} satisfies Parameters<typeof FunnelChart>[0]

const scatterPlotProps = {
  ...DEFAULT_SCATTER_PLOT_VIEW_PROPS,
  data: studyScoreData,
  ariaLabel: 'Study hours and exam score scatter plot',
  caption: some('Student study hours plotted against exam score.'),
} satisfies Parameters<typeof ScatterPlot>[0]

const varianceChartProps = {
  ...DEFAULT_VARIANCE_CHART_VIEW_PROPS,
  data: departmentalCostVarianceData,
  polarity: some(VARIANCE_LOWER_IS_BETTER),
  ariaLabel: 'Departmental cost variance chart',
  caption: some('Departmental actual spend compared with budget.'),
  formatValue: (value: number) => `$${value.toLocaleString()}`,
  formatVariance: formatSignedCurrency,
} satisfies Parameters<typeof VarianceChart>[0]

const progressBarProps = {
  ...DEFAULT_PROGRESS_BAR_VIEW_PROPS,
  currentValue: 73_000,
  total: 100_000,
  ariaLabel: 'Quarterly sales target progress',
  caption: some('Quarterly sales target completion.'),
  formatValue: (value: number) => `$${value.toLocaleString()}`,
} satisfies Parameters<typeof ProgressBar>[0]

const bulletChartProps = {
  ...DEFAULT_BULLET_CHART_VIEW_PROPS,
  currentValue: 87_000,
  targetValue: 100_000,
  bands: performanceBands,
  ariaLabel: 'Quarterly sales bullet chart',
  caption: some('Quarterly sales compared with target and performance bands.'),
  formatValue: (value: number) => `$${value.toLocaleString()}`,
} satisfies Parameters<typeof BulletChart>[0]

const gaugeChartProps = {
  ...DEFAULT_GAUGE_CHART_VIEW_PROPS,
  currentValue: 32,
  minimum: 0,
  maximum: 100,
  zones: performanceZones,
  ariaLabel: 'Customer satisfaction gauge chart',
  caption: some('Customer satisfaction score across performance zones.'),
  formatValue: (value: number) => `${value.toLocaleString()}%`,
} satisfies Parameters<typeof GaugeChart>[0]

const rankedListProps = {
  ...DEFAULT_RANKED_LIST_VIEW_PROPS,
  data: regionalSalesRankingsData.map(({ label, value, priorRank }) => ({
    label,
    value,
    priorRank: some(priorRank),
  })),
  ariaLabel: 'Regional sales ranked list',
  caption: some('Regional sales ordered by current period revenue.'),
  formatValue: (value: number) => `$${value.toLocaleString()}`,
} satisfies Parameters<typeof RankedList>[0]

const kpiCardProps = {
  ...DEFAULT_KPI_CARD_VIEW_PROPS,
  metricName: 'Monthly Revenue',
  currentValue: 124_500,
  referenceValue: 110_800,
  ariaLabel: 'Monthly revenue KPI card',
  caption: some('Current month revenue compared with last month.'),
  comparisonLabel: 'vs last month',
  formatValue: (value: number) => `$${value.toLocaleString()}`,
  formatChangeAmount: formatSignedCurrency,
} satisfies Parameters<typeof KPICard>[0]

const fields: Record<string, readonly RowField[]> = {
  categoryValue: [
    { key: 'category', label: 'category', type: 'text' },
    { key: 'value', label: 'value', type: 'number' },
  ],
  value: [
    { key: 'value', label: 'value', type: 'number' },
  ],
  point: [
    { key: 'x', label: 'x', type: 'number' },
    { key: 'y', label: 'y', type: 'number' },
  ],
  stageValue: [
    { key: 'stage', label: 'stage', type: 'text' },
    { key: 'value', label: 'value', type: 'number' },
  ],
  variance: [
    { key: 'category', label: 'category', type: 'text' },
    { key: 'actualValue', label: 'actualValue', type: 'number' },
    { key: 'budgetValue', label: 'budgetValue', type: 'number' },
  ],
  bands: [
    { key: 'label', label: 'label', type: 'text' },
    { key: 'lowerBound', label: 'lowerBound', type: 'number' },
    { key: 'upperBound', label: 'upperBound', type: 'number' },
  ],
  ranked: [
    { key: 'label', label: 'label', type: 'text' },
    { key: 'value', label: 'value', type: 'number' },
    { key: 'priorRank', label: 'priorRank', type: 'number' },
  ],
}

const dataShape = (
  summary: string,
  columns: readonly ChartDemoDataShapeColumn[],
  note: ChartDemoDataShape['note'],
): ChartDemoDataShape => ({
  summary,
  columns,
  note,
})

export const chartDemos: readonly ChartDemo[] = [
  {
    key: 'bar',
    title: 'Bar Chart',
    dataShape: dataShape(
      'One pre-aggregated observation per category, suitable for comparing discrete groups.',
      [
        { field: 'category', role: 'Nominal group label', example: 'North' },
        { field: 'value', role: 'Finite measure; can be positive or negative', example: '32' },
      ],
      some('Categories behave like named groups, not numeric bins.'),
    ),
    details: ['Requires at least one row.', 'Category names must be non-empty and unique.', 'Values must be numeric.'],
    controls: [{ kind: 'rows', label: 'data', stateKey: 'barData', fields: fields.categoryValue, createRow: always({ category: '', value: 0 }) }],
    renderCard: () => <BarChart {...barChartProps} />,
    renderPlayground: (state) => <BarChart {...barChartProps} data={toCategoryDataset(state.barData)} />,
  },
  {
    key: 'histogram',
    title: 'Histogram',
    dataShape: dataShape(
      'A raw sample of continuous numeric observations that the histogram groups into bins.',
      [
        { field: 'value', role: 'Single observation in the sample', example: '78' },
      ],
      some('This demo uses manual score thresholds from 40 through 100.'),
    ),
    details: ['Dataset must not be empty.', 'Every value must be numeric and finite.', 'Manual thresholds must be strictly ascending and cover the dataset range.'],
    controls: [{ kind: 'rows', label: 'data', stateKey: 'histogramData', fields: fields.value, createRow: always({ value: 0 }) }],
    renderCard: () => <HistogramChart {...histogramChartProps} />,
    renderPlayground: (state) => <HistogramChart {...histogramChartProps} data={toNumericDataset(state.histogramData)} />,
  },
  {
    key: 'boxPlot',
    title: 'Box Plot',
    dataShape: dataShape(
      'A raw numeric sample summarized into quartiles, whiskers, and outliers.',
      [
        { field: 'value', role: 'Observation used in distribution statistics', example: '85' },
      ],
      some('The chart computes median and spread from the observations.'),
    ),
    details: ['Requires at least five values.', 'Every value must be numeric and finite.', 'Duplicate, negative, and zero-spread values are valid.'],
    controls: [{ kind: 'rows', label: 'data', stateKey: 'boxPlotData', fields: fields.value, createRow: always({ value: 0 }) }],
    renderCard: () => <BoxPlot {...boxPlotProps} />,
    renderPlayground: (state) => <BoxPlot {...boxPlotProps} data={toNumericDataset(state.boxPlotData)} />,
  },
  {
    key: 'line',
    title: 'Line Chart',
    dataShape: dataShape(
      'Ordered numeric coordinates where consecutive points communicate change over the x scale.',
      [
        { field: 'x', role: 'Ordered numeric position', example: '5' },
        { field: 'y', role: 'Measured response at that position', example: '25' },
      ],
      some('String labels should be mapped to numeric x values before rendering.'),
    ),
    details: ['Requires at least two points.', 'X values must be unique, numeric, and finite.', 'Y values must be numeric and finite; negative values are valid.'],
    controls: [{ kind: 'rows', label: 'data', stateKey: 'lineData', fields: fields.point, createRow: always({ x: 0, y: 0 }) }],
    renderCard: () => <LineChart {...lineChartProps} />,
    renderPlayground: (state) => <LineChart {...lineChartProps} data={toPointDataset(state.lineData)} />,
  },
  {
    key: 'area',
    title: 'Area Chart',
    dataShape: dataShape(
      'Ordered numeric coordinates with a filled magnitude from each value down to the baseline.',
      [
        { field: 'x', role: 'Ordered numeric position', example: '4' },
        { field: 'y', role: 'Magnitude above or below the baseline', example: '1800' },
      ],
      some('The filled area emphasizes accumulated magnitude across the ordered scale.'),
    ),
    details: ['Requires at least two points.', 'X values must be unique, numeric, and finite.', 'The baseline must be finite and less than or equal to the minimum y value.'],
    controls: [{ kind: 'rows', label: 'data', stateKey: 'areaData', fields: fields.point, createRow: always({ x: 0, y: 0 }) }],
    renderCard: () => <AreaChart {...areaChartProps} />,
    renderPlayground: (state) => <AreaChart {...areaChartProps} data={toPointDataset(state.areaData)} />,
  },
  {
    key: 'sparkline',
    title: 'Sparkline',
    dataShape: dataShape(
      'A compact numeric series for showing trend direction without full chart furniture.',
      [
        { field: 'x', role: 'Ordered numeric position', example: '8' },
        { field: 'y', role: 'Measured value in the series', example: '121300' },
      ],
      some('Use sparklines when the shape of the movement matters more than exact axis reading.'),
    ),
    details: ['Requires at least two points.', 'X values must be unique, numeric, and finite.', 'Y values must be numeric and finite.'],
    controls: [{ kind: 'rows', label: 'data', stateKey: 'sparklineData', fields: fields.point, createRow: always({ x: 0, y: 0 }) }],
    renderCard: () => <Sparkline {...sparklineProps} />,
    renderPlayground: (state) => <Sparkline {...sparklineProps} data={toPointDataset(state.sparklineData)} />,
  },
  {
    key: 'pieDonut',
    title: 'Pie / Donut Chart',
    dataShape: dataShape(
      'Part-to-whole categories where each slice contributes a positive share of the total.',
      [
        { field: 'category', role: 'Slice label', example: 'Engineering' },
        { field: 'value', role: 'Positive contribution to the total', example: '450000' },
      ],
      some('Percentages are derived from the values, so callers provide counts or amounts.'),
    ),
    details: ['Requires at least two slices.', 'Values must be strictly positive finite numbers.', 'Category names must be non-empty and unique.'],
    controls: [{ kind: 'rows', label: 'data', stateKey: 'pieDonutData', fields: fields.categoryValue, createRow: always({ category: '', value: 1 }) }],
    renderCard: () => <PieDonutChart {...pieDonutChartProps} />,
    renderPlayground: (state) => <PieDonutChart {...pieDonutChartProps} data={toCategoryDataset(state.pieDonutData)} />,
  },
  {
    key: 'funnel',
    title: 'Funnel Chart',
    dataShape: dataShape(
      'Ordered process stages where each count represents the population remaining at that step.',
      [
        { field: 'stage', role: 'Step in the funnel sequence', example: 'Proposal' },
        { field: 'value', role: 'Count remaining at the step', example: '360' },
      ],
      some('Rows should move from the widest population to the narrowest conversion outcome.'),
    ),
    details: ['Requires at least two stages.', 'Stage values must be non-negative finite numbers and monotonically non-increasing.', 'Stage names must be non-empty and unique; the first value must be greater than zero.'],
    controls: [{ kind: 'rows', label: 'data', stateKey: 'funnelData', fields: fields.stageValue, createRow: always({ stage: '', value: 0 }) }],
    renderCard: () => <FunnelChart {...funnelChartProps} />,
    renderPlayground: (state) => <FunnelChart {...funnelChartProps} data={toStageDataset(state.funnelData)} />,
  },
  {
    key: 'scatter',
    title: 'Scatter Plot',
    dataShape: dataShape(
      'Paired numeric observations for exploring relationship, spread, and clustering.',
      [
        { field: 'x', role: 'Predictor or horizontal measure', example: '8' },
        { field: 'y', role: 'Response or vertical measure', example: '91' },
      ],
      some('Duplicate x values are allowed because multiple observations may share the same predictor value.'),
    ),
    details: ['Requires at least two points.', 'X and Y values must be numeric and finite.', 'Duplicate x values, duplicate y values, and identical points are valid.'],
    controls: [{ kind: 'rows', label: 'data', stateKey: 'scatterData', fields: fields.point, createRow: always({ x: 0, y: 0 }) }],
    renderCard: () => <ScatterPlot {...scatterPlotProps} />,
    renderPlayground: (state) => <ScatterPlot {...scatterPlotProps} data={toPointDataset(state.scatterData)} />,
  },
  {
    key: 'variance',
    title: 'Variance Chart',
    dataShape: dataShape(
      'Category-level actuals compared against a reference baseline to expose deltas.',
      [
        { field: 'category', role: 'Comparable group label', example: 'Support' },
        { field: 'actualValue', role: 'Observed amount', example: '73000' },
        { field: 'budgetValue', role: 'Expected or target amount', example: '68000' },
      ],
      some('Variance is computed from actual minus budget, then interpreted by polarity.'),
    ),
    details: ['Requires at least one row.', 'Actual values must be finite; budget values must be finite and non-zero.', 'Category names must be non-empty and unique, and metric polarity must be provided.'],
    controls: [{ kind: 'rows', label: 'data', stateKey: 'varianceData', fields: fields.variance, createRow: always({ category: '', actualValue: 0, budgetValue: 0 }) }],
    renderCard: () => <VarianceChart {...varianceChartProps} />,
    renderPlayground: (state) => (
      <VarianceChart
        {...varianceChartProps}
        data={state.varianceData.map((row) => ({
          category: asString(row.category),
          actualValue: toNumber(row.actualValue),
          budgetValue: toNumber(row.budgetValue),
        }))}
      />
    ),
  },
  {
    key: 'progress',
    title: 'Progress Bar',
    dataShape: dataShape(
      'A numerator and denominator describing completion toward a bounded total.',
      [
        { field: 'currentValue', role: 'Observed progress so far', example: '73000' },
        { field: 'total', role: 'Maximum or target denominator', example: '100000' },
      ],
      some('The displayed proportion is currentValue divided by total.'),
    ),
    details: ['Current value must be a finite number greater than or equal to zero.', 'Total must be a strictly positive finite number.', 'Current value must not exceed total.'],
    controls: [
      { kind: 'scalar', label: 'currentValue', stateKey: 'progressCurrentValue', type: 'number' },
      { kind: 'scalar', label: 'total', stateKey: 'progressTotal', type: 'number' },
    ],
    renderCard: () => <ProgressBar {...progressBarProps} />,
    renderPlayground: (state) => (
      <ProgressBar
        {...progressBarProps}
        currentValue={toNumber(state.progressCurrentValue)}
        total={toNumber(state.progressTotal)}
      />
    ),
  },
  {
    key: 'bullet',
    title: 'Bullet Chart',
    dataShape: dataShape(
      'A measured value, a target marker, and ordered bands that provide statistical context.',
      [
        { field: 'currentValue', role: 'Observed measure', example: '87000' },
        { field: 'targetValue', role: 'Benchmark or goal', example: '100000' },
        { field: 'label', role: 'Band name', example: 'Healthy' },
        { field: 'lowerBound', role: 'Inclusive band start', example: '80000' },
        { field: 'upperBound', role: 'Band end', example: '120000' },
      ],
      some('Bands should form a clean ordered scale around the measure and target.'),
    ),
    details: ['Current and target values must be finite numbers.', 'At least one band is required; bands must be contiguous, non-overlapping, and ordered by bounds.', 'Current and target must fall within the band scale, and band labels must be non-empty.'],
    controls: [
      { kind: 'scalar', label: 'currentValue', stateKey: 'bulletCurrentValue', type: 'number' },
      { kind: 'scalar', label: 'targetValue', stateKey: 'bulletTargetValue', type: 'number' },
      { kind: 'rows', label: 'bands', stateKey: 'bulletBands', fields: fields.bands, createRow: always({ label: '', lowerBound: 0, upperBound: 0 }) },
    ],
    renderCard: () => <BulletChart {...bulletChartProps} />,
    renderPlayground: (state) => (
      <BulletChart
        {...bulletChartProps}
        bands={toBands(state.bulletBands)}
        currentValue={toNumber(state.bulletCurrentValue)}
        targetValue={toNumber(state.bulletTargetValue)}
      />
    ),
  },
  {
    key: 'gauge',
    title: 'Gauge Chart',
    dataShape: dataShape(
      'A bounded reading plotted against a calibrated range and labelled performance zones.',
      [
        { field: 'currentValue', role: 'Current reading', example: '32' },
        { field: 'minimum', role: 'Scale lower limit', example: '0' },
        { field: 'maximum', role: 'Scale upper limit', example: '100' },
        { field: 'label', role: 'Zone name', example: 'Watch' },
        { field: 'lowerBound', role: 'Zone start', example: '45' },
        { field: 'upperBound', role: 'Zone end', example: '70' },
      ],
      some('Zones provide qualitative interpretation for the numeric reading.'),
    ),
    details: ['Minimum and maximum must be finite, and maximum must be greater than minimum.', 'Current value must be finite and within the scale range.', 'At least one zone is required; zones must exactly cover the scale with no gaps or overlaps, and labels must be non-empty.'],
    controls: [
      { kind: 'scalar', label: 'currentValue', stateKey: 'gaugeCurrentValue', type: 'number' },
      { kind: 'scalar', label: 'minimum', stateKey: 'gaugeMinimum', type: 'number' },
      { kind: 'scalar', label: 'maximum', stateKey: 'gaugeMaximum', type: 'number' },
      { kind: 'rows', label: 'zones', stateKey: 'gaugeZones', fields: fields.bands, createRow: always({ label: '', lowerBound: 0, upperBound: 0 }) },
    ],
    renderCard: () => <GaugeChart {...gaugeChartProps} />,
    renderPlayground: (state) => (
      <GaugeChart
        {...gaugeChartProps}
        currentValue={toNumber(state.gaugeCurrentValue)}
        maximum={toNumber(state.gaugeMaximum)}
        minimum={toNumber(state.gaugeMinimum)}
        zones={toBands(state.gaugeZones)}
      />
    ),
  },
  {
    key: 'rankedList',
    title: 'Ranked List',
    dataShape: dataShape(
      'Comparable labelled items ordered by a numeric score, with optional prior position.',
      [
        { field: 'label', role: 'Ranked item name', example: 'North' },
        { field: 'value', role: 'Metric used for ordering', example: '340000' },
        { field: 'priorRank', role: 'Previous ordinal rank', example: '3' },
      ],
      some('Leave priorRank blank when historical rank is unavailable.'),
    ),
    details: ['Requires at least two ranked items.', 'Values must be finite numbers, and labels must be non-empty and unique.', 'Prior ranks must be provided for all items or none; when provided, each prior rank must be a positive integer.'],
    controls: [{ kind: 'rows', label: 'data', stateKey: 'rankedListData', fields: fields.ranked, createRow: always({ label: '', value: 0, priorRank: '' }) }],
    renderCard: () => <RankedList {...rankedListProps} />,
    renderPlayground: (state) => <RankedList {...rankedListProps} data={toRankedItems(state.rankedListData)} />,
  },
  {
    key: 'kpi',
    title: 'KPI Card',
    dataShape: dataShape(
      'A headline metric with a current observation and a comparison baseline.',
      [
        { field: 'metricName', role: 'Name of the measured indicator', example: 'Monthly Revenue' },
        { field: 'currentValue', role: 'Current observation', example: '124500' },
        { field: 'referenceValue', role: 'Prior or target comparison value', example: '110800' },
      ],
      some('Change amount and percent are derived from currentValue versus referenceValue.'),
    ),
    details: ['Metric name must be non-empty.', 'Current value must be finite.', 'Reference value must be finite and non-zero; polarity controls whether movement is improved or declined.'],
    controls: [
      { kind: 'scalar', label: 'metricName', stateKey: 'kpiMetricName', type: 'text' },
      { kind: 'scalar', label: 'currentValue', stateKey: 'kpiCurrentValue', type: 'number' },
      { kind: 'scalar', label: 'referenceValue', stateKey: 'kpiReferenceValue', type: 'number' },
    ],
    renderCard: () => <KPICard {...kpiCardProps} />,
    renderPlayground: (state) => (
      <KPICard
        {...kpiCardProps}
        currentValue={toNumber(state.kpiCurrentValue)}
        metricName={asString(state.kpiMetricName)}
        referenceValue={toNumber(state.kpiReferenceValue)}
      />
    ),
  },
]
