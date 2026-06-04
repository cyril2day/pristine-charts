import { none } from '../shared'
import { ifElse } from '../shared/fp'

import type { BulletChartProps } from './BulletChart.types'

export const formatBulletChartNumber = ifElse(
  Number.isInteger,
  String,
  (value: number) => value.toFixed(2).replace(/\.?0+$/, ''),
)

export const DEFAULT_BULLET_CHART_VIEW_PROPS = {
  width: 420,
  height: 150,
  ariaLabel: 'Bullet chart',
  className: '',
  caption: none,
  showLabels: true,
  formatValue: formatBulletChartNumber,
} satisfies Omit<BulletChartProps, 'currentValue' | 'targetValue' | 'bands'>
