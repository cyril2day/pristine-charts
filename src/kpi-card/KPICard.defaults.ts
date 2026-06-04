import { none } from '../shared'
import { ifElse } from '../shared/fp'

import type { KPICardProps } from './KPICard.types'

export const formatKPICardNumber = ifElse(
  Number.isInteger,
  String,
  (value: number) => value.toFixed(2).replace(/\.?0+$/, ''),
)

export const formatKPICardSignedNumber = (value: number) =>
  ifElse(
    (candidate: number) => candidate > 0,
    (candidate: number) => `+${formatKPICardNumber(candidate)}`,
    formatKPICardNumber,
  )(value)

export const formatKPICardPercentage = (percentage: number) =>
  `${formatKPICardSignedNumber(percentage)}%`

export const DEFAULT_KPI_CARD_VIEW_PROPS = {
  width: 360,
  height: 140,
  ariaLabel: 'KPI card',
  className: '',
  caption: none,
  polarity: none,
  comparisonLabel: 'vs reference',
  formatValue: formatKPICardNumber,
  formatChangeAmount: formatKPICardSignedNumber,
  formatChangePercentage: formatKPICardPercentage,
} satisfies Omit<KPICardProps, 'metricName' | 'currentValue' | 'referenceValue'>
