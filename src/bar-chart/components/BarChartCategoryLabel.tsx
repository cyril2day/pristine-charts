import type { RenderedBar } from '../BarChart.model'

type BarChartCategoryLabelProps = {
  readonly bar: RenderedBar
  readonly height: number
}

export function BarChartCategoryLabel({ bar, height }: BarChartCategoryLabelProps) {
  return (
    <text
      className="pristine-bar-chart__label"
      x={bar.x + bar.width / 2}
      y={height - 12}
      textAnchor="middle"
    >
      {bar.category}
    </text>
  )
}
