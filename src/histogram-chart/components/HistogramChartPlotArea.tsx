import { HISTOGRAM_CHART_MARGIN } from '../HistogramChart.model'
import type { HistogramChartModel } from '../HistogramChart.model'

type HistogramChartPlotAreaProps = {
  readonly chart: HistogramChartModel
  readonly width: number
}

export function HistogramChartPlotArea({ chart, width }: HistogramChartPlotAreaProps) {
  return (
    <rect
      className="pristine-histogram-chart__plot"
      x={HISTOGRAM_CHART_MARGIN.left}
      y={HISTOGRAM_CHART_MARGIN.top}
      width={width - HISTOGRAM_CHART_MARGIN.left - HISTOGRAM_CHART_MARGIN.right}
      height={chart.plotBottom - HISTOGRAM_CHART_MARGIN.top}
    />
  )
}
