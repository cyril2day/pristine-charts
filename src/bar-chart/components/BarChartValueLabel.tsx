import type { RenderedBar } from '../BarChart.model'

type BarChartValueLabelProps = {
  readonly bar: RenderedBar
  readonly formatValue: (value: number) => string
}

export function BarChartValueLabel({ bar, formatValue }: BarChartValueLabelProps) {
  return (
    <text
      className="pristine-bar-chart__value"
      x={bar.x + bar.width / 2}
      y={bar.valueY}
      textAnchor="middle"
    >
      {formatValue(bar.value)}
    </text>
  )
}
