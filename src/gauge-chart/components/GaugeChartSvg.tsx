import type { GaugeChartModel } from '../GaugeChart.model'
import type { GaugeChartProps } from '../GaugeChart.types'

import { GaugeChartAxis } from './GaugeChartAxis'
import { GaugeChartNeedle } from './GaugeChartNeedle'
import { GaugeChartValueLabels } from './GaugeChartValueLabels'
import { GaugeChartZones } from './GaugeChartZones'

type GaugeChartSvgProps = Pick<
  GaugeChartProps,
  'ariaLabel' | 'formatValue' | 'height' | 'showLabels' | 'width'
> & {
  readonly chart: GaugeChartModel
}

export function GaugeChartSvg({
  ariaLabel,
  chart,
  formatValue,
  height,
  showLabels,
  width,
}: GaugeChartSvgProps) {
  const valueText = `${chart.currentLabel}, ${chart.activeZoneLabel}`

  return (
    <svg
      className="pristine-gauge-chart__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <g
        className="pristine-gauge-chart__meter"
        role="meter"
        aria-label={ariaLabel}
        aria-valuemin={chart.scaleRange.minimum}
        aria-valuemax={chart.scaleRange.maximum}
        aria-valuenow={chart.currentValue}
        aria-valuetext={valueText}
      >
        <g transform={`translate(${chart.centerX} ${chart.centerY})`}>
          <GaugeChartZones chart={chart} showLabels={showLabels} />
        </g>
        <GaugeChartNeedle chart={chart} />
        <GaugeChartValueLabels chart={chart} />
      </g>
      <GaugeChartAxis chart={chart} formatValue={formatValue} />
    </svg>
  )
}
