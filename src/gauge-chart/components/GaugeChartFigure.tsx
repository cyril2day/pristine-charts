import { classNames } from '@/shared'

import type { GaugeChartModel } from '../GaugeChart.model'
import type { GaugeChartProps } from '../GaugeChart.types'

import { GaugeChartCaption } from './GaugeChartCaption'
import { GaugeChartSvg } from './GaugeChartSvg'

type GaugeChartFigureProps = Pick<
  GaugeChartProps,
  'ariaLabel' | 'caption' | 'className' | 'formatValue' | 'height' | 'showLabels' | 'width'
> & {
  readonly chart: GaugeChartModel
}

export function GaugeChartFigure({
  ariaLabel,
  caption,
  chart,
  className,
  formatValue,
  height,
  showLabels,
  width,
}: GaugeChartFigureProps) {
  return (
    <figure className={classNames(['pristine-gauge-chart', className])} aria-label={ariaLabel}>
      <GaugeChartSvg
        ariaLabel={ariaLabel}
        chart={chart}
        formatValue={formatValue}
        height={height}
        showLabels={showLabels}
        width={width}
      />
      <GaugeChartCaption caption={caption} />
    </figure>
  )
}
