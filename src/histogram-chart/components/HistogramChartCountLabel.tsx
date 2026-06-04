import { HISTOGRAM_CHART_MARGIN } from '../HistogramChart.model'
import type { RenderedHistogramBin } from '../HistogramChart.model'

type HistogramChartCountLabelProps = {
  readonly bar: RenderedHistogramBin
}

export function HistogramChartCountLabel({ bar }: HistogramChartCountLabelProps) {
  return (
    <text
      className="pristine-histogram-chart__count"
      x={bar.x + bar.width / 2}
      y={Math.max(HISTOGRAM_CHART_MARGIN.top + 10, bar.y - 6)}
      textAnchor="middle"
    >
      {bar.count}
    </text>
  )
}
