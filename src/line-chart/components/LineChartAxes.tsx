import { LINE_CHART_MARGIN } from '../LineChart.model'
import type { LineChartModel } from '../LineChart.model'

type LineChartAxesProps = {
  readonly chart: LineChartModel
  readonly width: number
}

export function LineChartAxes({ chart, width }: LineChartAxesProps) {
  return (
    <>
      <line
        className="pristine-line-chart__axis"
        x1={LINE_CHART_MARGIN.left}
        x2={width - LINE_CHART_MARGIN.right}
        y1={chart.plotBottom}
        y2={chart.plotBottom}
      />
      <line
        className="pristine-line-chart__axis"
        x1={LINE_CHART_MARGIN.left}
        x2={LINE_CHART_MARGIN.left}
        y1={LINE_CHART_MARGIN.top}
        y2={chart.plotBottom}
      />
    </>
  )
}
