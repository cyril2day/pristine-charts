import { matchOption } from '../../shared'
import type { PieDonutChartProps } from '../PieDonutChart.types'

type PieDonutChartCaptionProps = Pick<PieDonutChartProps, 'caption'>

export function PieDonutChartCaption({ caption }: PieDonutChartCaptionProps) {
  return matchOption(caption, {
    none: () => null,
    some: (text) => <figcaption className="pristine-pie-donut-chart__caption">{text}</figcaption>,
  })
}
