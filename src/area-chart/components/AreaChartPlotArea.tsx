import { AREA_CHART_MARGIN } from '../AreaChart.model'
import type { AreaChartModel } from '../AreaChart.model'

type AreaChartPlotAreaProps = {
  readonly chart: AreaChartModel
  readonly width: number
}

export function AreaChartPlotArea({ chart, width }: AreaChartPlotAreaProps) {
  return (
    <rect
      className="pristine-area-chart__plot"
      x={AREA_CHART_MARGIN.left}
      y={AREA_CHART_MARGIN.top}
      width={width - AREA_CHART_MARGIN.left - AREA_CHART_MARGIN.right}
      height={chart.plotBottom - AREA_CHART_MARGIN.top}
    />
  )
}
