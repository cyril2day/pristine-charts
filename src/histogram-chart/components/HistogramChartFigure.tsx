import { classNames } from '../../shared'

import type { HistogramChartModel } from '../HistogramChart.model'
import type { HistogramChartProps } from '../HistogramChart.types'

import { HistogramChartCaption } from './HistogramChartCaption'
import { HistogramChartSvg } from './HistogramChartSvg'

type HistogramChartFigureProps = Pick<
  HistogramChartProps,
  'ariaLabel' | 'caption' | 'className' | 'height' | 'showCounts' | 'width'
> & {
  readonly chart: HistogramChartModel
}

export function HistogramChartFigure({
  ariaLabel,
  caption,
  chart,
  className,
  height,
  showCounts,
  width,
}: HistogramChartFigureProps) {
  return (
    <figure className={classNames(['pristine-histogram-chart', className])} aria-label={ariaLabel}>
      <HistogramChartSvg
        ariaLabel={ariaLabel}
        chart={chart}
        height={height}
        showCounts={showCounts}
        width={width}
      />
      <HistogramChartCaption caption={caption} />
    </figure>
  )
}
