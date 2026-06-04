import { none } from '../shared'
import { ifElse } from '../shared/fp'

import { DEFAULT_HISTOGRAM_BIN_STRATEGY } from './HistogramChart.domain'
import type { HistogramBin, HistogramChartProps } from './HistogramChart.types'

export const formatIntegerOrDecimal = ifElse(
  Number.isInteger,
  String,
  (value: number) => value.toFixed(2).replace(/\.?0+$/, ''),
)

export const formatDefaultBinLabel = (bin: HistogramBin) =>
  `${formatIntegerOrDecimal(bin.lowerBound)}-${formatIntegerOrDecimal(bin.upperBound)}`

export const DEFAULT_HISTOGRAM_CHART_VIEW_PROPS = {
  binStrategy: DEFAULT_HISTOGRAM_BIN_STRATEGY,
  width: 480,
  height: 260,
  ariaLabel: 'Histogram chart',
  className: '',
  caption: none,
  showCounts: false,
  formatBinLabel: formatDefaultBinLabel,
} satisfies Omit<HistogramChartProps, 'data'>
