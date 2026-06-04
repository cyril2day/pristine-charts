import { HISTOGRAM_CHART_MARGIN } from '../HistogramChart.model'
import type { HistogramChartModel } from '../HistogramChart.model'

type HistogramChartAxesProps = {
  readonly chart: HistogramChartModel
  readonly width: number
}

export function HistogramChartAxes({ chart, width }: HistogramChartAxesProps) {
  return (
    <>
      <line
        className="pristine-histogram-chart__axis"
        x1={HISTOGRAM_CHART_MARGIN.left}
        x2={width - HISTOGRAM_CHART_MARGIN.right}
        y1={chart.plotBottom}
        y2={chart.plotBottom}
      />
      <line
        className="pristine-histogram-chart__axis"
        x1={HISTOGRAM_CHART_MARGIN.left}
        x2={HISTOGRAM_CHART_MARGIN.left}
        y1={HISTOGRAM_CHART_MARGIN.top}
        y2={chart.plotBottom}
      />
    </>
  )
}
