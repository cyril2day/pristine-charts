import { classNames } from '@/shared'

import type { AreaChartModel } from '../AreaChart.model'
import type { AreaChartProps } from '../AreaChart.types'

import { AreaChartCaption } from './AreaChartCaption'
import { AreaChartSvg } from './AreaChartSvg'

type AreaChartFigureProps = Pick<
  AreaChartProps,
  | 'ariaLabel'
  | 'caption'
  | 'className'
  | 'formatXValue'
  | 'formatYValue'
  | 'height'
  | 'showPoints'
  | 'width'
> & {
  readonly chart: AreaChartModel
}

export function AreaChartFigure({
  ariaLabel,
  caption,
  chart,
  className,
  formatXValue,
  formatYValue,
  height,
  showPoints,
  width,
}: AreaChartFigureProps) {
  return (
    <figure className={classNames(['pristine-area-chart', className])} aria-label={ariaLabel}>
      <AreaChartSvg
        ariaLabel={ariaLabel}
        chart={chart}
        formatXValue={formatXValue}
        formatYValue={formatYValue}
        height={height}
        showPoints={showPoints}
        width={width}
      />
      <AreaChartCaption caption={caption} />
    </figure>
  )
}
