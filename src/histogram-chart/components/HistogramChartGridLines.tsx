import { HISTOGRAM_CHART_MARGIN } from '../HistogramChart.model'
import type { HistogramChartModel } from '../HistogramChart.model'

type HistogramChartGridLinesProps = {
  readonly chart: HistogramChartModel
  readonly width: number
}

export function HistogramChartGridLines({ chart, width }: HistogramChartGridLinesProps) {
  return chart.yTicks.map((tick) => (
    <g className="pristine-histogram-chart__grid-line" key={tick}>
      <line
        x1={HISTOGRAM_CHART_MARGIN.left}
        x2={width - HISTOGRAM_CHART_MARGIN.right}
        y1={chart.yScale(tick)}
        y2={chart.yScale(tick)}
      />
      <text x={HISTOGRAM_CHART_MARGIN.left - 8} y={chart.yScale(tick)} textAnchor="end">
        {tick}
      </text>
    </g>
  ))
}
