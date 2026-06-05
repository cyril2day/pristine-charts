import { none } from '../shared'

import type { FunnelChartProps } from './FunnelChart.types'

export const formatFunnelChartNumber = (value: number) => String(value)

export const formatFunnelChartPercentage = (rate: number) =>
  `${(rate * 100).toFixed(0)}%`

export const DEFAULT_FUNNEL_CHART_VIEW_PROPS = {
  width: 480,
  height: 280,
  ariaLabel: 'Funnel chart',
  className: '',
  caption: none,
  showValues: true,
  formatValue: formatFunnelChartNumber,
  formatPercentage: formatFunnelChartPercentage,
} satisfies Omit<FunnelChartProps, 'data'>
