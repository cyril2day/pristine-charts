import { SCATTER_PLOT_MARGIN } from '../ScatterPlot.model'
import type { ScatterPlotModel } from '../ScatterPlot.model'

type ScatterPlotGridLinesProps = {
  readonly chart: ScatterPlotModel
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
  readonly height: number
  readonly width: number
}

export function ScatterPlotGridLines({
  chart,
  formatXValue,
  formatYValue,
  height,
  width,
}: ScatterPlotGridLinesProps) {
  return (
    <>
      {chart.yTicks.map((tick) => (
        <g className="pristine-scatter-plot__grid-line" key={`y:${tick}`}>
          <line
            x1={SCATTER_PLOT_MARGIN.left}
            x2={width - SCATTER_PLOT_MARGIN.right}
            y1={chart.yScale(tick)}
            y2={chart.yScale(tick)}
          />
          <text x={SCATTER_PLOT_MARGIN.left - 8} y={chart.yScale(tick)} textAnchor="end">
            {formatYValue(tick)}
          </text>
        </g>
      ))}
      {chart.xTicks.map((tick) => (
        <g className="pristine-scatter-plot__grid-line" key={`x:${tick}`}>
          <line
            x1={chart.xScale(tick)}
            x2={chart.xScale(tick)}
            y1={SCATTER_PLOT_MARGIN.top}
            y2={chart.plotBottom}
          />
          <text
            x={chart.xScale(tick)}
            y={height - SCATTER_PLOT_MARGIN.bottom + 20}
            textAnchor="middle"
          >
            {formatXValue(tick)}
          </text>
        </g>
      ))}
    </>
  )
}
