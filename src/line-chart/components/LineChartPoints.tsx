import type { LineChartModel } from '../LineChart.model'

import { LineChartPointMarker } from './LineChartPointMarker'

type LineChartPointsProps = {
  readonly activeXValue: number | null
  readonly chart: LineChartModel
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
  readonly onActivate: (xValue: number) => void
  readonly onDeactivate: () => void
  readonly showPoints: boolean
}

export function LineChartPoints({
  activeXValue,
  chart,
  formatXValue,
  formatYValue,
  onActivate,
  onDeactivate,
  showPoints,
}: LineChartPointsProps) {
  return chart.points.map((point) => (
    <LineChartPointMarker
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
