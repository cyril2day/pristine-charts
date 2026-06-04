import { none } from '../shared'
import { ifElse } from '../shared/fp'

import type { ScatterPlotProps } from './ScatterPlot.types'

export const formatScatterPlotNumber = ifElse(
  Number.isInteger,
  String,
  (value: number) => value.toFixed(2).replace(/\.?0+$/, ''),
)

export const DEFAULT_SCATTER_PLOT_VIEW_PROPS = {
  width: 480,
  height: 280,
  ariaLabel: 'Scatter plot',
  className: '',
  caption: none,
  formatXValue: formatScatterPlotNumber,
  formatYValue: formatScatterPlotNumber,
} satisfies Omit<ScatterPlotProps, 'data'>
