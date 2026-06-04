import { matchOption } from '../../shared'

import type { BarChartProps } from '../BarChart.types'

export function BarChartCaption({ caption }: Pick<BarChartProps, 'caption'>) {
  return matchOption(caption, {
    none: () => null,
    some: (value) => <figcaption className="pristine-bar-chart__caption">{value}</figcaption>,
  })
}
