import { classNames } from '@/shared'

import type { BulletChartModel } from '../BulletChart.model'
import type { BulletChartProps } from '../BulletChart.types'

import { BulletChartCaption } from './BulletChartCaption'
import { BulletChartSvg } from './BulletChartSvg'

type BulletChartFigureProps = Pick<
  BulletChartProps,
  'ariaLabel' | 'caption' | 'className' | 'formatValue' | 'height' | 'showLabels' | 'width'
> & {
  readonly chart: BulletChartModel
}

export function BulletChartFigure({
  ariaLabel,
  caption,
  chart,
  className,
  formatValue,
  height,
  showLabels,
  width,
}: BulletChartFigureProps) {
  return (
    <figure className={classNames(['pristine-bullet-chart', className])} aria-label={ariaLabel}>
      <BulletChartSvg
        ariaLabel={ariaLabel}
        chart={chart}
        formatValue={formatValue}
        height={height}
        showLabels={showLabels}
        width={width}
      />
      <BulletChartCaption caption={caption} />
    </figure>
  )
}
