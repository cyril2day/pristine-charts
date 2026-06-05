import { matchOption } from '@/shared'

import type { VarianceChartProps } from '../VarianceChart.types'

export function VarianceChartCaption({ caption }: Pick<VarianceChartProps, 'caption'>) {
  return matchOption(caption, {
    none: () => null,
    some: (value) => (
      <figcaption className="pristine-variance-chart__caption">{value}</figcaption>
    ),
  })
}
