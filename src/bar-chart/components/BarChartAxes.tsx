import { BAR_CHART_MARGIN } from '../BarChart.model'
import type { BarChartModel } from '../BarChart.model'

type BarChartAxesProps = {
  readonly chart: BarChartModel
  readonly width: number
}

export function BarChartAxes({ chart, width }: BarChartAxesProps) {
  return (
    <>
      <line
        className="pristine-bar-chart__axis"
        x1={BAR_CHART_MARGIN.left}
        x2={width - BAR_CHART_MARGIN.right}
        y1={chart.baselineY}
        y2={chart.baselineY}
      />
      <line
        className="pristine-bar-chart__axis"
        x1={BAR_CHART_MARGIN.left}
        x2={BAR_CHART_MARGIN.left}
        y1={BAR_CHART_MARGIN.top}
        y2={chart.plotBottom}
      />
    </>
  )
}
