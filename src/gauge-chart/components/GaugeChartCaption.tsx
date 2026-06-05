import { matchOption } from '@/shared'

import type { GaugeChartProps } from '../GaugeChart.types'

type GaugeChartCaptionProps = Pick<GaugeChartProps, 'caption'>

export function GaugeChartCaption({ caption }: GaugeChartCaptionProps) {
  return matchOption(caption, {
    none: () => null,
    some: (text) => <figcaption className="pristine-gauge-chart__caption">{text}</figcaption>,
  })
}
