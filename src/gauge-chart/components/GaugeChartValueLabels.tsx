import type { GaugeChartModel } from '../GaugeChart.model'

type GaugeChartValueLabelsProps = {
  readonly chart: GaugeChartModel
}

export function GaugeChartValueLabels({ chart }: GaugeChartValueLabelsProps) {
  return (
    <g className="pristine-gauge-chart__value-labels" aria-hidden="true">
      <text
        className="pristine-gauge-chart__value-label"
        x={chart.valueLabelX}
        y={chart.valueLabelY}
        textAnchor="middle"
      >
        {chart.currentLabel}
      </text>
      <text
        className="pristine-gauge-chart__active-zone-label"
        x={chart.zoneLabelX}
        y={chart.zoneLabelY}
        textAnchor="middle"
      >
        {chart.activeZoneLabel}
      </text>
    </g>
  )
}
