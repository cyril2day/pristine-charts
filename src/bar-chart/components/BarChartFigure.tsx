import { classNames } from '../../shared'

import type { BarChartModel } from '../BarChart.model'
import type { BarChartProps } from '../BarChart.types'

import { BarChartCaption } from './BarChartCaption'
import { BarChartSvg } from './BarChartSvg'

type BarChartFigureProps = Pick<
  BarChartProps,
  'ariaLabel' | 'caption' | 'className' | 'formatValue' | 'height' | 'showValues' | 'width'
> & {
  readonly chart: BarChartModel
}

export function BarChartFigure({
  ariaLabel,
  caption,
  chart,
  className,
  formatValue,
  height,
  showValues,
  width,
}: BarChartFigureProps) {
  return (
    <figure className={classNames(['pristine-bar-chart', className])} aria-label={ariaLabel}>
      <BarChartSvg
        ariaLabel={ariaLabel}
        chart={chart}
        formatValue={formatValue}
        height={height}
        showValues={showValues}
        width={width}
      />
      <BarChartCaption caption={caption} />
    </figure>
  )
}
