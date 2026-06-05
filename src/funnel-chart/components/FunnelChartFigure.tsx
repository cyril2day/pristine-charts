import { classNames } from '@/shared'

import type { FunnelChartModel } from '../FunnelChart.model'
import type { FunnelChartProps } from '../FunnelChart.types'

import { FunnelChartCaption } from './FunnelChartCaption'
import { FunnelChartSvg } from './FunnelChartSvg'

type FunnelChartFigureProps = Pick<
  FunnelChartProps,
  | 'ariaLabel'
  | 'caption'
  | 'className'
  | 'formatPercentage'
  | 'formatValue'
  | 'height'
  | 'showValues'
  | 'width'
> & {
  readonly chart: FunnelChartModel
}

export function FunnelChartFigure({
  ariaLabel,
  caption,
  chart,
  className,
  formatPercentage,
  formatValue,
  height,
  showValues,
  width,
}: FunnelChartFigureProps) {
  return (
    <figure className={classNames(['pristine-funnel-chart', className])} aria-label={ariaLabel}>
      <FunnelChartSvg
        ariaLabel={ariaLabel}
        chart={chart}
        formatPercentage={formatPercentage}
        formatValue={formatValue}
        height={height}
        showValues={showValues}
        width={width}
      />
      <FunnelChartCaption caption={caption} />
    </figure>
  )
}
