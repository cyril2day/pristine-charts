import { none } from '../shared'
import { ifElse } from '../shared/fp'

import type { AreaChartProps } from './AreaChart.types'

export const formatAreaChartNumber = ifElse(
  Number.isInteger,
  String,
  (value: number) => value.toFixed(2).replace(/\.?0+$/, ''),
)

export const DEFAULT_AREA_CHART_VIEW_PROPS = {
  width: 480,
  height: 280,
  ariaLabel: 'Area chart',
  className: '',
  caption: none,
  baseline: none,
  showPoints: true,
  formatXValue: formatAreaChartNumber,
  formatYValue: formatAreaChartNumber,
} satisfies Omit<AreaChartProps, 'data'>
