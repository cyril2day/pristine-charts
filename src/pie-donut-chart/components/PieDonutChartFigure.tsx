import { classNames } from '../../shared'

import type { PieDonutChartModel } from '../PieDonutChart.model'
import type { PieDonutChartProps } from '../PieDonutChart.types'

import { PieDonutChartCaption } from './PieDonutChartCaption'
import { PieDonutChartSvg } from './PieDonutChartSvg'

type PieDonutChartFigureProps = Pick<
  PieDonutChartProps,
  | 'ariaLabel'
  | 'caption'
  | 'className'
  | 'formatPercentage'
  | 'formatValue'
  | 'height'
  | 'showLabels'
  | 'width'
> & {
  readonly chart: PieDonutChartModel
}

export function PieDonutChartFigure({
  ariaLabel,
  caption,
  chart,
  className,
  formatPercentage,
  formatValue,
  height,
  showLabels,
  width,
}: PieDonutChartFigureProps) {
  return (
    <figure className={classNames(['pristine-pie-donut-chart', className])} aria-label={ariaLabel}>
      <PieDonutChartSvg
        ariaLabel={ariaLabel}
        chart={chart}
        formatPercentage={formatPercentage}
        formatValue={formatValue}
        height={height}
        showLabels={showLabels}
        width={width}
      />
      <PieDonutChartCaption caption={caption} />
    </figure>
  )
}
