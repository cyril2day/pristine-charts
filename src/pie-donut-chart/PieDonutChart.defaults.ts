import { none } from '../shared'
import { ifElse } from '../shared/fp'

import type { PieDonutChartProps } from './PieDonutChart.types'

export const formatPieDonutChartNumber = ifElse(
  Number.isInteger,
  String,
  (value: number) => value.toFixed(2).replace(/\.?0+$/, ''),
)

export const formatPieDonutChartPercentage = (proportion: number) =>
  `${formatPieDonutChartNumber(proportion * 100)}%`

export const DEFAULT_PIE_DONUT_CHART_VIEW_PROPS = {
  width: 360,
  height: 320,
  ariaLabel: 'Pie chart',
  className: '',
  caption: none,
  variant: none,
  showLabels: true,
  formatValue: formatPieDonutChartNumber,
  formatPercentage: formatPieDonutChartPercentage,
} satisfies Omit<PieDonutChartProps, 'data'>
