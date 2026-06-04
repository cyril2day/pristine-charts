import { matchOption } from '../../shared'

import type { HistogramChartProps } from '../HistogramChart.types'

export function HistogramChartCaption({ caption }: Pick<HistogramChartProps, 'caption'>) {
  return matchOption(caption, {
    none: () => null,
    some: (value) => (
      <figcaption className="pristine-histogram-chart__caption">{value}</figcaption>
    ),
  })
}
