import type { GaugeChartModel } from '../GaugeChart.model'

type GaugeChartNeedleProps = {
  readonly chart: GaugeChartModel
}

export function GaugeChartNeedle({ chart }: GaugeChartNeedleProps) {
  return (
    <g className="pristine-gauge-chart__needle" aria-hidden="true">
      <line
        className="pristine-gauge-chart__needle-halo"
        x1={chart.centerX}
        x2={chart.needleX}
        y1={chart.centerY}
        y2={chart.needleY}
      />
      <line
        className="pristine-gauge-chart__needle-line"
        x1={chart.centerX}
        x2={chart.needleX}
        y1={chart.centerY}
        y2={chart.needleY}
      />
      <circle
        className="pristine-gauge-chart__needle-cap-halo"
        cx={chart.centerX}
        cy={chart.centerY}
        r="8"
      />
      <circle
        className="pristine-gauge-chart__needle-cap"
        cx={chart.centerX}
        cy={chart.centerY}
        r="5"
      />
    </g>
  )
}
