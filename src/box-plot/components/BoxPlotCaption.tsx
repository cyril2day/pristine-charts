import { matchOption } from '@/shared'
import type { BoxPlotProps } from '../BoxPlot.types'

type BoxPlotCaptionProps = Pick<BoxPlotProps, 'caption'>

export function BoxPlotCaption({ caption }: BoxPlotCaptionProps) {
  return matchOption(caption, {
    none: () => null,
    some: (content) => (
      <figcaption className="pristine-box-plot__caption">{content}</figcaption>
    ),
  })
}
