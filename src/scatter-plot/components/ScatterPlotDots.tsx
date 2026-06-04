import type { ScatterPlotModel } from '../ScatterPlot.model'

import { ScatterPlotDotMarker } from './ScatterPlotDotMarker'

type ScatterPlotDotsProps = {
  readonly activeDotIndex: number | null
  readonly chart: ScatterPlotModel
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
  readonly onActivate: (dotIndex: number) => void
  readonly onDeactivate: () => void
}

export function ScatterPlotDots({
  activeDotIndex,
  chart,
  formatXValue,
  formatYValue,
  onActivate,
  onDeactivate,
}: ScatterPlotDotsProps) {
  return chart.dots.map((dot) => (
    <ScatterPlotDotMarker
      active={activeDotIndex === dot.index}
      dot={dot}
      formatXValue={formatXValue}
      formatYValue={formatYValue}
      key={dot.index}
      onActivate={() => onActivate(dot.index)}
      onDeactivate={onDeactivate}
    />
  ))
}
