import { classNames } from '@/shared'

import type { VarianceChartModel } from '../VarianceChart.model'
import type { VarianceChartProps } from '../VarianceChart.types'

import { VarianceChartCaption } from './VarianceChartCaption'
import { VarianceChartSvg } from './VarianceChartSvg'

type VarianceChartFigureProps = Pick<
  VarianceChartProps,
  | 'ariaLabel'
  | 'caption'
  | 'className'
  | 'displayMode'
  | 'formatPercentage'
  | 'formatValue'
  | 'formatVariance'
  | 'height'
  | 'showValues'
  | 'width'
> & {
  readonly chart: VarianceChartModel
}

export function VarianceChartFigure({
  ariaLabel,
  caption,
  chart,
  className,
  displayMode,
  formatPercentage,
  formatValue,
  formatVariance,
  height,
  showValues,
  width,
}: VarianceChartFigureProps) {
  return (
    <figure className={classNames(['pristine-variance-chart', className])} aria-label={ariaLabel}>
      <VarianceChartSvg
        ariaLabel={ariaLabel}
        chart={chart}
        displayMode={displayMode}
        formatPercentage={formatPercentage}
        formatValue={formatValue}
        formatVariance={formatVariance}
        height={height}
        showValues={showValues}
        width={width}
      />
      <VarianceChartCaption caption={caption} />
    </figure>
  )
}
