import { scaleLinear } from 'd3'

import { always, cond, map } from '../shared/fp'

import type {
  BulletChartSummary,
  PerformanceBand,
  ScaleRange,
} from './BulletChart.types'

export const BULLET_CHART_MARGIN = {
  top: 46,
  right: 40,
  bottom: 54,
  left: 40,
}

export type RenderedBulletChartBand = PerformanceBand & {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly labelX: number
  readonly labelY: number
}

export type BulletChartTickTextAnchor = 'start' | 'middle' | 'end'

export type RenderedBulletChartTick = {
  readonly value: number
  readonly x: number
  readonly textAnchor: BulletChartTickTextAnchor
}

export type BulletChartModel = {
  readonly currentValue: number
  readonly targetValue: number
  readonly scaleRange: ScaleRange
  readonly activeBand: PerformanceBand
  readonly bands: readonly RenderedBulletChartBand[]
  readonly ticks: readonly RenderedBulletChartTick[]
  readonly scaleX: (value: number) => number
  readonly plotX: number
  readonly plotY: number
  readonly plotWidth: number
  readonly bandHeight: number
  readonly trackRadius: number
  readonly currentBarX: number
  readonly currentBarY: number
  readonly currentBarWidth: number
  readonly currentBarHeight: number
  readonly targetX: number
  readonly targetY1: number
  readonly targetY2: number
  readonly axisY: number
  readonly tickLabelY: number
  readonly valueLabelY: number
  readonly currentLabel: string
  readonly targetLabel: string
  readonly activeBandLabel: string
}

const BAND_HEIGHT = 38
const CURRENT_BAR_HEIGHT = 14
const TARGET_MARKER_OVERHANG = 9
const BAND_LABEL_OFFSET = 16
const AXIS_OFFSET = 30
const TICK_LABEL_OFFSET = 18
const MINIMUM_BAND_HEIGHT = 24
const VALUE_LABEL_Y = 22
const START_TICK_TEXT_ANCHOR: BulletChartTickTextAnchor = 'start'
const MIDDLE_TICK_TEXT_ANCHOR: BulletChartTickTextAnchor = 'middle'
const END_TICK_TEXT_ANCHOR: BulletChartTickTextAnchor = 'end'

const clamp = (minimum: number, maximum: number, value: number) =>
  Math.min(Math.max(value, minimum), maximum)

const getBaselineValue = (scaleRange: ScaleRange) =>
  clamp(scaleRange.lowerBound, scaleRange.upperBound, 0)

const getScaleMidpoint = (scaleRange: ScaleRange) =>
  scaleRange.lowerBound + (scaleRange.upperBound - scaleRange.lowerBound) / 2

const getScaleTicks = (scaleRange: ScaleRange) => [
  scaleRange.lowerBound,
  getScaleMidpoint(scaleRange),
  scaleRange.upperBound,
]

const getTickTextAnchor: (
  index: number,
  ticks: readonly number[],
) => BulletChartTickTextAnchor = (index, ticks) =>
  cond([
    [(candidate: number) => candidate === 0, always(START_TICK_TEXT_ANCHOR)],
    [(candidate: number) => candidate === ticks.length - 1, always(END_TICK_TEXT_ANCHOR)],
    [always(true), always(MIDDLE_TICK_TEXT_ANCHOR)],
  ])(index)

export const buildBulletChartModel = (
  summary: BulletChartSummary,
  width: number,
  height: number,
  formatValue: (value: number) => string,
): BulletChartModel => {
  const plotX = BULLET_CHART_MARGIN.left
  const plotY = BULLET_CHART_MARGIN.top
  const plotWidth = width - BULLET_CHART_MARGIN.left - BULLET_CHART_MARGIN.right
  const bandHeight = Math.max(
    MINIMUM_BAND_HEIGHT,
    Math.min(
      BAND_HEIGHT,
      height - BULLET_CHART_MARGIN.top - BULLET_CHART_MARGIN.bottom,
    ),
  )
  const scaleX = scaleLinear()
    .domain([summary.scaleRange.lowerBound, summary.scaleRange.upperBound])
    .range([plotX, plotX + plotWidth])
  const baselineX = scaleX(getBaselineValue(summary.scaleRange))
  const currentX = scaleX(summary.currentValue)
  const targetX = scaleX(summary.targetValue)
  const ticks = getScaleTicks(summary.scaleRange)

  const toRenderedBand = (band: PerformanceBand): RenderedBulletChartBand => {
    const startX = scaleX(band.lowerBound)
    const endX = scaleX(band.upperBound)

    return {
      ...band,
      x: startX,
      y: plotY,
      width: endX - startX,
      height: bandHeight,
      labelX: startX + (endX - startX) / 2,
      labelY: plotY + bandHeight + BAND_LABEL_OFFSET,
    }
  }

  return {
    currentValue: summary.currentValue,
    targetValue: summary.targetValue,
    scaleRange: summary.scaleRange,
    activeBand: summary.activeBand,
    bands: map(toRenderedBand, [...summary.bands]),
    ticks: ticks.map((tick, index) => ({
      value: tick,
      x: scaleX(tick),
      textAnchor: getTickTextAnchor(index, ticks),
    })),
    scaleX,
    plotX,
    plotY,
    plotWidth,
    bandHeight,
    trackRadius: Math.min(10, bandHeight / 2),
    currentBarX: Math.min(baselineX, currentX),
    currentBarY: plotY + (bandHeight - CURRENT_BAR_HEIGHT) / 2,
    currentBarWidth: Math.abs(currentX - baselineX),
    currentBarHeight: CURRENT_BAR_HEIGHT,
    targetX,
    targetY1: plotY - TARGET_MARKER_OVERHANG,
    targetY2: plotY + bandHeight + TARGET_MARKER_OVERHANG,
    axisY: plotY + bandHeight + AXIS_OFFSET,
    tickLabelY: plotY + bandHeight + AXIS_OFFSET + TICK_LABEL_OFFSET,
    valueLabelY: VALUE_LABEL_Y,
    currentLabel: `Current ${formatValue(summary.currentValue)}`,
    targetLabel: `Target ${formatValue(summary.targetValue)}`,
    activeBandLabel: summary.activeBand.label,
  }
}
