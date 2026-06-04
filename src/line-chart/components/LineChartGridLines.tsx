import { LINE_CHART_MARGIN } from '../LineChart.model'
import type { LineChartModel } from '../LineChart.model'

type LineChartGridLinesProps = {
  readonly chart: LineChartModel
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
  readonly height: number
  readonly width: number
}

export function LineChartGridLines({
  chart,
  formatXValue,
  formatYValue,
  height,
  width,
}: LineChartGridLinesProps) {
  return (
    <>
      {chart.yTicks.map((tick) => (
        <g className="pristine-line-chart__grid-line" key={`y:${tick}`}>
          <line
            x1={LINE_CHART_MARGIN.left}
            x2={width - LINE_CHART_MARGIN.right}
            y1={chart.yScale(tick)}
            y2={chart.yScale(tick)}
          />
          <text x={LINE_CHART_MARGIN.left - 8} y={chart.yScale(tick)} textAnchor="end">
            {formatYValue(tick)}
          </text>
        </g>
      ))}
      {chart.xTicks.map((tick) => (
        <g className="pristine-line-chart__grid-line" key={`x:${tick}`}>
          <line
            x1={chart.xScale(tick)}
            x2={chart.xScale(tick)}
            y1={LINE_CHART_MARGIN.top}
            y2={chart.plotBottom}
          />
          <text
            x={chart.xScale(tick)}
            y={height - LINE_CHART_MARGIN.bottom + 20}
            textAnchor="middle"
          >
            {formatXValue(tick)}
          </text>
        </g>
      ))}
    </>
  )
}
