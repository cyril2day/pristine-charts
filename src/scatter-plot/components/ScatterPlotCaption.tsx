import { matchOption } from '../../shared'

import type { ScatterPlotProps } from '../ScatterPlot.types'

export function ScatterPlotCaption({ caption }: Pick<ScatterPlotProps, 'caption'>) {
  return matchOption(caption, {
    none: () => null,
    some: (text) => <figcaption className="pristine-scatter-plot__caption">{text}</figcaption>,
  })
}
