import { none } from '../shared'

import type { SparklineProps } from './Sparkline.types'

export const DEFAULT_SPARKLINE_VIEW_PROPS = {
  width: 240,
  height: 72,
  ariaLabel: 'Sparkline',
  className: '',
  caption: none,
} satisfies Omit<SparklineProps, 'data'>
