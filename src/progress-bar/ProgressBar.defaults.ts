import { none } from '../shared'
import { ifElse } from '../shared/fp'

import type { ProgressBarProps } from './ProgressBar.types'

export const formatProgressBarNumber = ifElse(
  Number.isInteger,
  String,
  (value: number) => value.toFixed(2).replace(/\.?0+$/, ''),
)

export const formatProgressBarPercentage = (ratio: number) =>
  `${formatProgressBarNumber(ratio * 100)}%`

export const DEFAULT_PROGRESS_BAR_VIEW_PROPS = {
  width: 360,
  height: 92,
  ariaLabel: 'Progress bar',
  className: '',
  caption: none,
  showLabel: true,
  formatValue: formatProgressBarNumber,
  formatPercentage: formatProgressBarPercentage,
} satisfies Omit<ProgressBarProps, 'currentValue' | 'total'>
