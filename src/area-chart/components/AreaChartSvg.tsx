import { useState } from 'react'

import type { AreaChartModel } from '../AreaChart.model'
import type { AreaChartProps } from '../AreaChart.types'

import { AreaChartAxes } from './AreaChartAxes'
import { AreaChartFilledRegion } from './AreaChartFilledRegion'
import { AreaChartGridLines } from './AreaChartGridLines'
import { AreaChartLine } from './AreaChartLine'
import { AreaChartPlotArea } from './AreaChartPlotArea'
import { AreaChartPoints } from './AreaChartPoints'
import { AreaChartTooltip } from './AreaChartTooltip'

type AreaChartSvgProps = Pick<
  AreaChartProps,
  'ariaLabel' | 'formatXValue' | 'formatYValue' | 'height' | 'showPoints' | 'width'
> & {
  readonly chart: AreaChartModel
}

export function AreaChartSvg({
  ariaLabel,
  chart,
  formatXValue,
  formatYValue,
  height,
  showPoints,
  width,
}: AreaChartSvgProps) {
  const [activeXValue, setActiveXValue] = useState<number | null>(null)
  const activePoints = chart.points.filter((point) => point.x === activeXValue)

  return (
    <svg
      className="pristine-area-chart__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <AreaChartPlotArea chart={chart} width={width} />
      <AreaChartGridLines
        chart={chart}
        formatXValue={formatXValue}
        formatYValue={formatYValue}
        height={height}
        width={width}
      />
      <AreaChartAxes chart={chart} width={width} />
      <AreaChartFilledRegion chart={chart} />
      <AreaChartLine chart={chart} />
      <AreaChartPoints
        activeXValue={activeXValue}
        chart={chart}
        formatXValue={formatXValue}
        formatYValue={formatYValue}
        onActivate={setActiveXValue}
        onDeactivate={() => setActiveXValue(null)}
        showPoints={showPoints}
      />
      {activePoints.map((point) => (
        <AreaChartTooltip
          formatXValue={formatXValue}
          formatYValue={formatYValue}
          height={height}
          key={point.x}
          point={point}
          width={width}
        />
      ))}
    </svg>
  )
}
