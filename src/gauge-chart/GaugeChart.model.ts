import { arc as createArc } from 'd3'

import { always, cond, defaultTo } from '../shared/fp'

import type {
  GaugeChartSummary,
  PerformanceZone,
  ScaleRange,
} from './GaugeChart.types'

export const GAUGE_CHART_MARGIN = {
  top: 34,
  right: 42,
  bottom: 54,
  left: 42,
}

export type GaugeChartTextAnchor = 'start' | 'middle' | 'end'

export type RenderedGaugeChartZone = PerformanceZone & {
  readonly colorIndex: number
  readonly startAngle: number
  readonly endAngle: number
  readonly path: string
  readonly labelX: number
  readonly labelY: number
  readonly labelAnchor: GaugeChartTextAnchor
}

export type RenderedGaugeChartTick = {
  readonly value: number
  readonly x: number
  readonly y: number
  readonly textAnchor: GaugeChartTextAnchor
}

export type GaugeChartModel = {
  readonly currentValue: number
  readonly scaleRange: ScaleRange
  readonly activeZone: PerformanceZone
  readonly needlePosition: number
  readonly zones: readonly RenderedGaugeChartZone[]
  readonly ticks: readonly RenderedGaugeChartTick[]
  readonly centerX: number
  readonly centerY: number
  readonly innerRadius: number
  readonly outerRadius: number
  readonly needleAngle: number
  readonly needleX: number
  readonly needleY: number
  readonly valueLabelX: number
  readonly valueLabelY: number
  readonly zoneLabelX: number
  readonly zoneLabelY: number
  readonly currentLabel: string
  readonly activeZoneLabel: string
}

const START_ANGLE = -Math.PI / 2
const END_ANGLE = Math.PI / 2
const ARC_THICKNESS_RATIO = 0.25
const MINIMUM_ARC_THICKNESS = 20 
const MAXIMUM_ARC_THICKNESS = 30
const NEEDLE_INSET = 18
const ZONE_LABEL_OFFSET = 22
const TICK_LABEL_OFFSET = 18
const END_TICK_LABEL_GUTTER = 18

const clamp = (minimum: number, maximum: number, value: number) =>
  Math.min(Math.max(value, minimum), maximum)

const getPlotWidth = (width: number) =>
  Math.max(0, width - GAUGE_CHART_MARGIN.left - GAUGE_CHART_MARGIN.right)

const getCenterY = (height: number) => height - GAUGE_CHART_MARGIN.bottom

const getOuterRadius = (width: number, height: number) =>
  Math.max(
    0,
    Math.min(
      getPlotWidth(width) / 2 - END_TICK_LABEL_GUTTER,
      getCenterY(height) - GAUGE_CHART_MARGIN.top,
    ),
  )

const getArcThickness = (outerRadius: number) =>
  clamp(MINIMUM_ARC_THICKNESS, MAXIMUM_ARC_THICKNESS, outerRadius * ARC_THICKNESS_RATIO)

const getAngle = (position: number) =>
  START_ANGLE + position * (END_ANGLE - START_ANGLE)

const toPosition = (scaleRange: ScaleRange) => (value: number) =>
  (value - scaleRange.minimum) / (scaleRange.maximum - scaleRange.minimum)

const getPolarPoint = (
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
) => ({
  x: centerX + Math.sin(angle) * radius,
  y: centerY - Math.cos(angle) * radius,
})

const getScaleMidpoint = (scaleRange: ScaleRange) =>
  scaleRange.minimum + (scaleRange.maximum - scaleRange.minimum) / 2

const getScaleTicks = (scaleRange: ScaleRange) => [
  scaleRange.minimum,
  getScaleMidpoint(scaleRange),
  scaleRange.maximum,
]

const getLabelAnchor: (x: number, centerX: number) => GaugeChartTextAnchor = cond([
  [
    (x: number, centerX: number) => Math.abs(x - centerX) < 8,
    always('middle'),
  ],
  [(x: number, centerX: number) => x > centerX, always('start')],
  [always(true), always('end')],
])

const renderZonePath = (innerRadius: number, outerRadius: number) =>
  (zone: Pick<RenderedGaugeChartZone, 'startAngle' | 'endAngle'>) =>
    defaultTo(
      '',
      createArc<typeof zone>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle((candidate) => candidate.startAngle)
        .endAngle((candidate) => candidate.endAngle)
        .cornerRadius(2)(zone),
    )

export const buildGaugeChartModel = (
  summary: GaugeChartSummary,
  width: number,
  height: number,
  formatValue: (value: number) => string,
): GaugeChartModel => {
  const centerX = width / 2
  const centerY = getCenterY(height)
  const outerRadius = getOuterRadius(width, height)
  const innerRadius = Math.max(0, outerRadius - getArcThickness(outerRadius))
  const toScalePosition = toPosition(summary.scaleRange)
  const toAngle = (value: number) => getAngle(toScalePosition(value))
  const zonePath = renderZonePath(innerRadius, outerRadius)
  const needleAngle = getAngle(summary.needlePosition)
  const needlePoint = getPolarPoint(
    centerX,
    centerY,
    Math.max(0, outerRadius - NEEDLE_INSET),
    needleAngle,
  )
  const toRenderedZone = (
    zone: PerformanceZone,
    index: number,
  ): RenderedGaugeChartZone => {
    const startAngle = toAngle(zone.lowerBound)
    const endAngle = toAngle(zone.upperBound)
    const labelPoint = getPolarPoint(
      0,
      0,
      outerRadius + ZONE_LABEL_OFFSET,
      (startAngle + endAngle) / 2,
    )
    const renderedZone = {
      ...zone,
      colorIndex: index % 8,
      startAngle,
      endAngle,
      path: '',
      labelX: labelPoint.x,
      labelY: labelPoint.y,
      labelAnchor: getLabelAnchor(labelPoint.x, 0),
    }

    return {
      ...renderedZone,
      path: zonePath(renderedZone),
    }
  }

  return {
    currentValue: summary.currentValue,
    scaleRange: summary.scaleRange,
    activeZone: summary.activeZone,
    needlePosition: summary.needlePosition,
    zones: summary.zones.map(toRenderedZone),
    ticks: getScaleTicks(summary.scaleRange).map((tick) => {
      const point = getPolarPoint(centerX, centerY, outerRadius + TICK_LABEL_OFFSET, toAngle(tick))

      return {
        value: tick,
        x: point.x,
        y: point.y,
        textAnchor: getLabelAnchor(point.x, centerX),
      }
    }),
    centerX,
    centerY,
    innerRadius,
    outerRadius,
    needleAngle,
    needleX: needlePoint.x,
    needleY: needlePoint.y,
    valueLabelX: centerX,
    valueLabelY: centerY - outerRadius * 0.36,
    zoneLabelX: centerX,
    zoneLabelY: centerY - outerRadius * 0.18,
    currentLabel: formatValue(summary.currentValue),
    activeZoneLabel: summary.activeZone.label,
  }
}
