import { none } from '../shared'

import { DEFAULT_BAR_CHART_ORDER_STRATEGY } from './BarChart.domain'
import type { BarChartProps } from './BarChart.types'

export const formatDefaultValue = (value: number) => String(value)

export const DEFAULT_BAR_CHART_VIEW_PROPS = {
  width: 480,
  height: 280,
  ariaLabel: 'Bar chart',
  className: '',
  caption: none,
  orderStrategy: DEFAULT_BAR_CHART_ORDER_STRATEGY,
  showValues: false,
  formatValue: formatDefaultValue,
} satisfies Omit<BarChartProps, 'data'>
