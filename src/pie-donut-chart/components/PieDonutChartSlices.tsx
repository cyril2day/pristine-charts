import type { PieDonutChartModel } from '../PieDonutChart.model'

import { PieDonutChartSlice } from './PieDonutChartSlice'

type PieDonutChartSlicesProps = {
  readonly activeCategory: string | null
  readonly chart: PieDonutChartModel
  readonly formatPercentage: (proportion: number) => string
  readonly formatValue: (value: number) => string
  readonly onActivate: (category: string) => void
  readonly onDeactivate: () => void
}

export function PieDonutChartSlices({
  activeCategory,
  chart,
  formatPercentage,
  formatValue,
  onActivate,
  onDeactivate,
}: PieDonutChartSlicesProps) {
  return chart.arcs.map((arc) => (
    <PieDonutChartSlice
      active={activeCategory === arc.category}
      arc={arc}
      formatPercentage={formatPercentage}
      formatValue={formatValue}
      key={arc.category}
      onActivate={() => onActivate(arc.category)}
      onDeactivate={onDeactivate}
    />
  ))
}
