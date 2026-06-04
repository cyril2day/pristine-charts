import { matchOption } from '@/shared'

import type { BulletChartProps } from '../BulletChart.types'

type BulletChartCaptionProps = Pick<BulletChartProps, 'caption'>

export function BulletChartCaption({ caption }: BulletChartCaptionProps) {
  return matchOption(caption, {
    none: () => null,
    some: (value) => (
      <figcaption className="pristine-bullet-chart__caption">{value}</figcaption>
    ),
  })
}
