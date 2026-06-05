import { VARIANCE_CHART_MARGIN } from '../VarianceChart.model'
import type { VarianceChartModel } from '../VarianceChart.model'

type VarianceChartAxesProps = {
  readonly chart: VarianceChartModel
  readonly width: number
}

export function VarianceChartAxes({ chart, width }: VarianceChartAxesProps) {
  return (
    <>
      <line
        className="pristine-variance-chart__axis"
        x1={VARIANCE_CHART_MARGIN.left}
        x2={width - VARIANCE_CHART_MARGIN.right}
        y1={chart.baselineY}
        y2={chart.baselineY}
      />
      <line
        className="pristine-variance-chart__axis"
        x1={VARIANCE_CHART_MARGIN.left}
        x2={VARIANCE_CHART_MARGIN.left}
        y1={VARIANCE_CHART_MARGIN.top}
        y2={chart.plotBottom}
      />
    </>
  )
}
