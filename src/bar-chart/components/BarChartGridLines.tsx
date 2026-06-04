import { BAR_CHART_MARGIN } from '../BarChart.model'
import type { BarChartModel } from '../BarChart.model'

type BarChartGridLinesProps = {
  readonly chart: BarChartModel
  readonly width: number
}

export function BarChartGridLines({ chart, width }: BarChartGridLinesProps) {
  return chart.yTicks.map((tick) => (
    <g className="pristine-bar-chart__grid-line" key={tick}>
      <line
        x1={BAR_CHART_MARGIN.left}
        x2={width - BAR_CHART_MARGIN.right}
        y1={chart.yScale(tick)}
        y2={chart.yScale(tick)}
      />
      <text x={BAR_CHART_MARGIN.left - 8} y={chart.yScale(tick)} textAnchor="end">
        {tick}
      </text>
    </g>
  ))
}
