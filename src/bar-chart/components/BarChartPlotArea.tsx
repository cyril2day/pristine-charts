import { BAR_CHART_MARGIN } from '../BarChart.model'
import type { BarChartModel } from '../BarChart.model'

type BarChartPlotAreaProps = {
  readonly chart: BarChartModel
  readonly width: number
}

export function BarChartPlotArea({ chart, width }: BarChartPlotAreaProps) {
  return (
    <rect
      className="pristine-bar-chart__plot"
      x={BAR_CHART_MARGIN.left}
      y={BAR_CHART_MARGIN.top}
      width={width - BAR_CHART_MARGIN.left - BAR_CHART_MARGIN.right}
      height={chart.plotBottom - BAR_CHART_MARGIN.top}
    />
  )
}
