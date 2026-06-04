import type { AreaChartModel } from '../AreaChart.model'

import { AreaChartPointMarker } from './AreaChartPointMarker'

type AreaChartPointsProps = {
  readonly activeXValue: number | null
  readonly chart: AreaChartModel
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
  readonly onActivate: (xValue: number) => void
  readonly onDeactivate: () => void
  readonly showPoints: boolean
}

export function AreaChartPoints({
  activeXValue,
  chart,
  formatXValue,
  formatYValue,
  onActivate,
  onDeactivate,
  showPoints,
}: AreaChartPointsProps) {
  return chart.points.map((point) => (
    <AreaChartPointMarker
      active={activeXValue === point.x}
      formatXValue={formatXValue}
      formatYValue={formatYValue}
      key={point.x}
      onActivate={() => onActivate(point.x)}
      onDeactivate={onDeactivate}
      point={point}
      showPoints={showPoints}
    />
  ))
}
