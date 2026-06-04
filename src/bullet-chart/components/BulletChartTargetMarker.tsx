import type { BulletChartModel } from '../BulletChart.model'

type BulletChartTargetMarkerProps = {
  readonly chart: BulletChartModel
}

export function BulletChartTargetMarker({ chart }: BulletChartTargetMarkerProps) {
  return (
    <g className="pristine-bullet-chart__target" aria-hidden="true">
      <line
        className="pristine-bullet-chart__target-marker-halo"
        x1={chart.targetX}
        x2={chart.targetX}
        y1={chart.targetY1}
        y2={chart.targetY2}
      />
      <line
        className="pristine-bullet-chart__target-marker"
        x1={chart.targetX}
        x2={chart.targetX}
        y1={chart.targetY1}
        y2={chart.targetY2}
      />
    </g>
  )
}
