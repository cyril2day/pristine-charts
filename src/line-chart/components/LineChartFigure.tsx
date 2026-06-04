import { classNames } from '../../shared'

import type { LineChartModel } from '../LineChart.model'
import type { LineChartProps } from '../LineChart.types'

import { LineChartCaption } from './LineChartCaption'
import { LineChartSvg } from './LineChartSvg'

type LineChartFigureProps = Pick<
  LineChartProps,
  | 'ariaLabel'
  | 'caption'
  | 'className'
  | 'formatXValue'
  | 'formatYValue'
  | 'height'
  | 'showPoints'
  | 'width'
> & {
  readonly chart: LineChartModel
}

export function LineChartFigure({
  ariaLabel,
  caption,
  chart,
  className,
  formatXValue,
  formatYValue,
  height,
  showPoints,
  width,
}: LineChartFigureProps) {
  return (
    <figure className={classNames(['pristine-line-chart', className])} aria-label={ariaLabel}>
      <LineChartSvg
        ariaLabel={ariaLabel}
        chart={chart}
        formatXValue={formatXValue}
        formatYValue={formatYValue}
        height={height}
        showPoints={showPoints}
        width={width}
      />
      <LineChartCaption caption={caption} />
    </figure>
  )
}
