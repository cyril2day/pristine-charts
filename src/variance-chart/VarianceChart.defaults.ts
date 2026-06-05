import { none } from '../shared'
import { cond, ifElse } from '../shared/fp'

import type { VarianceChartProps } from './VarianceChart.types'

export const DEFAULT_VARIANCE_CHART_DISPLAY_MODE = 'absolute'

export const formatVarianceChartNumber = (value: number) =>
  ifElse(
    Number.isInteger,
    String,
    (candidate: number) => candidate.toFixed(2).replace(/\.?0+$/, ''),
  )(value)

export const formatVarianceChartSignedNumber = (value: number) => {
  const sign = cond([
    [(candidate: number) => candidate > 0, () => '+'],
    [(candidate: number) => candidate < 0, () => '-'],
    [() => true, () => ''],
  ])(value)

  return `${sign}${formatVarianceChartNumber(Math.abs(value))}`
}

export const formatVarianceChartPercentage = (percentage: number) =>
  `${formatVarianceChartSignedNumber(percentage)}%`

export const DEFAULT_VARIANCE_CHART_VIEW_PROPS = {
  width: 480,
  height: 280,
  ariaLabel: 'Variance chart',
  className: '',
  caption: none,
  polarity: none,
  displayMode: DEFAULT_VARIANCE_CHART_DISPLAY_MODE,
  showValues: false,
  formatValue: formatVarianceChartNumber,
  formatVariance: formatVarianceChartSignedNumber,
  formatPercentage: formatVarianceChartPercentage,
} satisfies Omit<VarianceChartProps, 'data'>
