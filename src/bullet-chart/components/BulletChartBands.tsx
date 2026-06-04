import type { BulletChartModel } from '../BulletChart.model'
import { classNames } from '@/shared'
import { ifElse } from '@/shared/fp'

type BulletChartBandsProps = {
  readonly chart: BulletChartModel
  readonly showLabels: boolean
}

const toBandClassName = (index: number) =>
  `pristine-bullet-chart__band pristine-bullet-chart__band--${String(index + 1)}`

const isActiveBand = (
  chart: BulletChartModel,
  band: BulletChartModel['bands'][number],
) =>
  chart.activeBand.label === band.label

const toActiveBandClassName = ifElse(
  (candidate: boolean) => candidate,
  () => 'pristine-bullet-chart__band-group--active',
  () => '',
)

const toBandGroupClassName = (
  chart: BulletChartModel,
  band: BulletChartModel['bands'][number],
) =>
  classNames([
    'pristine-bullet-chart__band-group',
    toActiveBandClassName(isActiveBand(chart, band)),
  ])

const renderLabel = (band: BulletChartModel['bands'][number]) =>
  ifElse(
    (candidate: boolean) => candidate,
    () => (
      <text
        className="pristine-bullet-chart__band-label"
        x={band.labelX}
        y={band.labelY}
        textAnchor="middle"
        aria-hidden="true"
      >
        {band.label}
      </text>
    ),
    () => null,
  )

export function BulletChartBands({ chart, showLabels }: BulletChartBandsProps) {
  return (
    <g className="pristine-bullet-chart__bands">
      {chart.bands.map((band, index) => (
        <g className={toBandGroupClassName(chart, band)} key={band.label}>
          <rect
            className={toBandClassName(index)}
            x={band.x}
            y={band.y}
            width={band.width}
            height={band.height}
          />
          {renderLabel(band)(showLabels)}
        </g>
      ))}
    </g>
  )
}
