import type { BulletChartModel } from '../BulletChart.model'

type BulletChartCurrentBarProps = {
  readonly chart: BulletChartModel
}

export function BulletChartCurrentBar({ chart }: BulletChartCurrentBarProps) {
  return (
    <rect
      className="pristine-bullet-chart__current-bar"
      x={chart.currentBarX}
      y={chart.currentBarY}
      width={chart.currentBarWidth}
      height={chart.currentBarHeight}
      rx={chart.currentBarHeight / 2}
    />
  )
}
