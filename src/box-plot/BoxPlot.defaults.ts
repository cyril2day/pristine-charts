import { none } from '../shared'
import { ifElse } from '../shared/fp'

import type { BoxPlotProps } from './BoxPlot.types'

export const formatBoxPlotNumber = ifElse(
  Number.isInteger,
  String,
  (value: number) => value.toFixed(2).replace(/\.?0+$/, ''),
)

export const DEFAULT_BOX_PLOT_VIEW_PROPS = {
  width: 480,
  height: 240,
  ariaLabel: 'Box plot',
  className: '',
  caption: none,
  formatValue: formatBoxPlotNumber,
} satisfies Omit<BoxPlotProps, 'data'>
