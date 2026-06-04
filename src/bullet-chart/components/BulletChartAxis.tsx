import type { BulletChartModel } from '../BulletChart.model'

type BulletChartAxisProps = {
  readonly chart: BulletChartModel
  readonly formatValue: (value: number) => string
}

export function BulletChartAxis({ chart, formatValue }: BulletChartAxisProps) {
  return (
    <g className="pristine-bullet-chart__axis" aria-hidden="true">
      <line
        x1={chart.plotX}
        x2={chart.plotX + chart.plotWidth}
        y1={chart.axisY}
        y2={chart.axisY}
      />
      {chart.ticks.map((tick) => (
        <g className="pristine-bullet-chart__tick" key={tick.value}>
          <line
            x1={tick.x}
            x2={tick.x}
            y1={chart.axisY}
            y2={chart.axisY + 5}
          />
          <text x={tick.x} y={chart.tickLabelY} textAnchor={tick.textAnchor}>
            {formatValue(tick.value)}
          </text>
        </g>
      ))}
    </g>
  )
}
