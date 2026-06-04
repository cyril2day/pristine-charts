import { useState } from 'react'

import type { LineChartModel } from '../LineChart.model'
import type { LineChartProps } from '../LineChart.types'

import { LineChartAxes } from './LineChartAxes'
import { LineChartGridLines } from './LineChartGridLines'
import { LineChartPath } from './LineChartPath'
import { LineChartPlotArea } from './LineChartPlotArea'
import { LineChartPoints } from './LineChartPoints'
import { LineChartTooltip } from './LineChartTooltip'

type LineChartSvgProps = Pick<
  LineChartProps,
  'ariaLabel' | 'formatXValue' | 'formatYValue' | 'height' | 'showPoints' | 'width'
> & {
  readonly chart: LineChartModel
}

export function LineChartSvg({
  ariaLabel,
  chart,
  formatXValue,
  formatYValue,
  height,
  showPoints,
  width,
}: LineChartSvgProps) {
  const [activeXValue, setActiveXValue] = useState<number | null>(null)
  const activePoints = chart.points.filter((point) => point.x === activeXValue)

  return (
    <svg
      className="pristine-line-chart__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <LineChartPlotArea chart={chart} width={width} />
      <LineChartGridLines
        chart={chart}
        formatXValue={formatXValue}
        formatYValue={formatYValue}
        height={height}
        width={width}
      />
      <LineChartAxes chart={chart} width={width} />
      <LineChartPath chart={chart} />
      <LineChartPoints
        activeXValue={activeXValue}
        chart={chart}
        formatXValue={formatXValue}
        formatYValue={formatYValue}
        onActivate={setActiveXValue}
        onDeactivate={() => setActiveXValue(null)}
        showPoints={showPoints}
      />
      {activePoints.map((point) => (
        <LineChartTooltip
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
