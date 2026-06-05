import { classNames } from '@/shared'
import { ifElse } from '@/shared/fp'

import type { GaugeChartModel } from '../GaugeChart.model'

type GaugeChartZonesProps = {
  readonly chart: GaugeChartModel
  readonly showLabels: boolean
}

const isActiveZone = (
  chart: GaugeChartModel,
  zone: GaugeChartModel['zones'][number],
) =>
  chart.activeZone.label === zone.label

const toActiveZoneClassName = ifElse(
  (candidate: boolean) => candidate,
  () => 'pristine-gauge-chart__zone-group--active',
  () => '',
)

const toZoneGroupClassName = (
  chart: GaugeChartModel,
  zone: GaugeChartModel['zones'][number],
) =>
  classNames([
    'pristine-gauge-chart__zone-group',
    toActiveZoneClassName(isActiveZone(chart, zone)),
  ])

const toZoneClassName = (index: number) =>
  `pristine-gauge-chart__zone pristine-gauge-chart__zone--tone-${String(index)}`

const renderLabel = (zone: GaugeChartModel['zones'][number]) =>
  ifElse(
    (candidate: boolean) => candidate,
    () => (
      <text
        className="pristine-gauge-chart__zone-label"
        x={zone.labelX}
        y={zone.labelY}
        textAnchor={zone.labelAnchor}
        aria-hidden="true"
      >
        {zone.label}
      </text>
    ),
    () => null,
  )

export function GaugeChartZones({ chart, showLabels }: GaugeChartZonesProps) {
  return (
    <g className="pristine-gauge-chart__zones">
      {chart.zones.map((zone) => (
        <g className={toZoneGroupClassName(chart, zone)} key={zone.label}>
          <path className={toZoneClassName(zone.colorIndex)} d={zone.path} />
          {renderLabel(zone)(showLabels)}
        </g>
      ))}
    </g>
  )
}
