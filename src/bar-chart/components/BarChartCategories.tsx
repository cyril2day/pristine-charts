import type { BarChartModel } from '../BarChart.model'

import { BarChartCategory } from './BarChartCategory'

type BarChartCategoriesProps = {
  readonly activeCategory: string | null
  readonly chart: BarChartModel
  readonly formatValue: (value: number) => string
  readonly height: number
  readonly onActivate: (category: string) => void
  readonly onDeactivate: () => void
  readonly showValues: boolean
}

export function BarChartCategories({
  activeCategory,
  chart,
  formatValue,
  height,
  onActivate,
  onDeactivate,
  showValues,
}: BarChartCategoriesProps) {
  return chart.bars.map((bar) => (
    <BarChartCategory
      active={activeCategory === bar.category}
      bar={bar}
      formatValue={formatValue}
      height={height}
      key={bar.category}
      onActivate={() => onActivate(bar.category)}
      onDeactivate={onDeactivate}
      showValues={showValues}
    />
  ))
}
