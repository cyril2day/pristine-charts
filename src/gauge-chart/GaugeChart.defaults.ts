import { none } from '../shared'
import { ifElse } from '../shared/fp'

import type { GaugeChartProps } from './GaugeChart.types'

export const formatGaugeChartNumber = ifElse(
  Number.isInteger,
  String,
  (value: number) => value.toFixed(2).replace(/\.?0+$/, ''),
)

export const DEFAULT_GAUGE_CHART_VIEW_PROPS = {
  width: 420,
  height: 260,
  ariaLabel: 'Gauge chart',
  className: '',
  caption: none,
  showLabels: true,
  formatValue: formatGaugeChartNumber,
} satisfies Omit<GaugeChartProps, 'currentValue' | 'minimum' | 'maximum' | 'zones'>
