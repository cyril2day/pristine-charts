import type { GaugeChartModel } from '../GaugeChart.model'

type GaugeChartAxisProps = {
  readonly chart: GaugeChartModel
  readonly formatValue: (value: number) => string
}

export function GaugeChartAxis({ chart, formatValue }: GaugeChartAxisProps) {
  return (
    <g className="pristine-gauge-chart__axis" aria-hidden="true">
      {chart.ticks.map((tick) => (
        <text
          className="pristine-gauge-chart__tick"
          key={tick.value}
          x={tick.x}
          y={tick.y}
          textAnchor={tick.textAnchor}
        >
          {formatValue(tick.value)}
        </text>
      ))}
    </g>
  )
}
