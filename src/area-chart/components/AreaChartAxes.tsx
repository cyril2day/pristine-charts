import { AREA_CHART_MARGIN } from '../AreaChart.model'
import type { AreaChartModel } from '../AreaChart.model'

type AreaChartAxesProps = {
  readonly chart: AreaChartModel
  readonly width: number
}

export function AreaChartAxes({ chart, width }: AreaChartAxesProps) {
  return (
    <>
      <line
        className="pristine-area-chart__axis"
        x1={AREA_CHART_MARGIN.left}
        x2={width - AREA_CHART_MARGIN.right}
        y1={chart.plotBottom}
        y2={chart.plotBottom}
      />
      <line
        className="pristine-area-chart__axis"
        x1={AREA_CHART_MARGIN.left}
        x2={AREA_CHART_MARGIN.left}
        y1={AREA_CHART_MARGIN.top}
        y2={chart.plotBottom}
      />
    </>
  )
}
