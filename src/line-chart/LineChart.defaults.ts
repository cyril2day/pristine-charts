import { none } from '../shared'
import { ifElse } from '../shared/fp'

import type { LineChartProps } from './LineChart.types'

export const formatLineChartNumber = ifElse(
  Number.isInteger,
  String,
  (value: number) => value.toFixed(2).replace(/\.?0+$/, ''),
)

export const DEFAULT_LINE_CHART_VIEW_PROPS = {
  width: 480,
  height: 280,
  ariaLabel: 'Line chart',
  className: '',
  caption: none,
  showPoints: true,
  formatXValue: formatLineChartNumber,
  formatYValue: formatLineChartNumber,
} satisfies Omit<LineChartProps, 'data'>
