import { useId } from 'react'

import { ifElse } from '@/shared/fp'

import type { BulletChartModel } from '../BulletChart.model'
import type { BulletChartProps } from '../BulletChart.types'

import { BulletChartAxis } from './BulletChartAxis'
import { BulletChartBands } from './BulletChartBands'
import { BulletChartCurrentBar } from './BulletChartCurrentBar'
import { BulletChartTargetMarker } from './BulletChartTargetMarker'
import { BulletChartValueLabels } from './BulletChartValueLabels'

type BulletChartSvgProps = Pick<
  BulletChartProps,
  'ariaLabel' | 'formatValue' | 'height' | 'showLabels' | 'width'
> & {
  readonly chart: BulletChartModel
}

const hasCurrentBar = (chart: BulletChartModel) => chart.currentBarWidth > 0

export function BulletChartSvg({
  ariaLabel,
  chart,
  formatValue,
  height,
  showLabels,
  width,
}: BulletChartSvgProps) {
  const clipPathId = `pristine-bullet-chart-track-${useId().replaceAll(':', '')}`
  const valueText = `${chart.currentLabel}, ${chart.targetLabel}, ${chart.activeBandLabel}`
  const renderCurrentBar = ifElse(
    hasCurrentBar,
    () => <BulletChartCurrentBar chart={chart} />,
    () => null,
  )

  return (
    <svg
      className="pristine-bullet-chart__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <clipPath id={clipPathId}>
          <rect
            x={chart.plotX}
            y={chart.plotY}
            width={chart.plotWidth}
            height={chart.bandHeight}
            rx={chart.trackRadius}
          />
        </clipPath>
      </defs>
      <BulletChartValueLabels chart={chart} />
      <g
        className="pristine-bullet-chart__meter"
        role="meter"
        aria-label={ariaLabel}
        aria-valuemin={chart.scaleRange.lowerBound}
        aria-valuemax={chart.scaleRange.upperBound}
        aria-valuenow={chart.currentValue}
        aria-valuetext={valueText}
      >
        <rect
          className="pristine-bullet-chart__track-shell"
          x={chart.plotX}
          y={chart.plotY}
          width={chart.plotWidth}
          height={chart.bandHeight}
          rx={chart.trackRadius}
        />
        <g clipPath={`url(#${clipPathId})`}>
          <BulletChartBands chart={chart} showLabels={showLabels} />
          {renderCurrentBar(chart)}
        </g>
        <BulletChartTargetMarker chart={chart} />
      </g>
      <BulletChartAxis chart={chart} formatValue={formatValue} />
    </svg>
  )
}
