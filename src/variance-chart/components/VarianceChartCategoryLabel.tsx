import type { RenderedVarianceEntry } from '../VarianceChart.model'

type VarianceChartCategoryLabelProps = {
  readonly entry: RenderedVarianceEntry
  readonly height: number
}

export function VarianceChartCategoryLabel({ entry, height }: VarianceChartCategoryLabelProps) {
  return (
    <text
      className="pristine-variance-chart__label"
      x={entry.x + entry.width / 2}
      y={height - 12}
      textAnchor="middle"
    >
      {entry.category}
    </text>
  )
}
