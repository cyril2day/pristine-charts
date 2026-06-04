import { LINE_CHART_MARGIN } from '../LineChart.model'
import type { LineChartModel } from '../LineChart.model'

type LineChartPlotAreaProps = {
  readonly chart: LineChartModel
  readonly width: number
}

export function LineChartPlotArea({ chart, width }: LineChartPlotAreaProps) {
  return (
    <rect
      className="pristine-line-chart__plot"
      x={LINE_CHART_MARGIN.left}
      y={LINE_CHART_MARGIN.top}
      width={width - LINE_CHART_MARGIN.left - LINE_CHART_MARGIN.right}
      height={chart.plotBottom - LINE_CHART_MARGIN.top}
    />
  )
}
