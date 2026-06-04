import type { BulletChartModel } from '../BulletChart.model'

type BulletChartValueLabelsProps = {
  readonly chart: BulletChartModel
}

export function BulletChartValueLabels({ chart }: BulletChartValueLabelsProps) {
  return (
    <g className="pristine-bullet-chart__value-labels" aria-hidden="true">
      <text
        className="pristine-bullet-chart__value-label pristine-bullet-chart__value-label--current"
        x={chart.plotX}
        y={chart.valueLabelY}
      >
        {chart.currentLabel}
      </text>
      <text
        className="pristine-bullet-chart__value-label pristine-bullet-chart__value-label--target"
        x={chart.plotX + chart.plotWidth}
        y={chart.valueLabelY}
        textAnchor="end"
      >
        {chart.targetLabel}
      </text>
    </g>
  )
}
