import { VARIANCE_CHART_MARGIN } from '../VarianceChart.model'
import type { VarianceChartModel } from '../VarianceChart.model'

type VarianceChartPlotAreaProps = {
  readonly chart: VarianceChartModel
  readonly width: number
}

export function VarianceChartPlotArea({ chart, width }: VarianceChartPlotAreaProps) {
  return (
    <rect
      className="pristine-variance-chart__plot"
      x={VARIANCE_CHART_MARGIN.left}
      y={VARIANCE_CHART_MARGIN.top}
      width={width - VARIANCE_CHART_MARGIN.left - VARIANCE_CHART_MARGIN.right}
      height={chart.plotBottom - VARIANCE_CHART_MARGIN.top}
    />
  )
}
