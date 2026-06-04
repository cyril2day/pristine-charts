import { matchOption } from '@/shared'

import type { LineChartProps } from '../LineChart.types'

export function LineChartCaption({ caption }: Pick<LineChartProps, 'caption'>) {
  return matchOption(caption, {
    none: () => null,
    some: (text) => <figcaption className="pristine-line-chart__caption">{text}</figcaption>,
  })
}
