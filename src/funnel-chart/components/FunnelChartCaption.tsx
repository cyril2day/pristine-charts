import { matchOption } from '@/shared'
import type { FunnelChartProps } from '../FunnelChart.types'

type FunnelChartCaptionProps = Pick<FunnelChartProps, 'caption'>

export function FunnelChartCaption({ caption }: FunnelChartCaptionProps) {
  return matchOption(caption, {
    none: () => null,
    some: (text) => (
      <figcaption className="pristine-funnel-chart__caption">{text}</figcaption>
    ),
  })
}
