import { matchOption } from '../../shared'

import type { AreaChartProps } from '../AreaChart.types'

export function AreaChartCaption({ caption }: Pick<AreaChartProps, 'caption'>) {
  return matchOption(caption, {
    none: () => null,
    some: (text) => <figcaption className="pristine-area-chart__caption">{text}</figcaption>,
  })
}
