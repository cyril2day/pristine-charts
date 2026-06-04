import { area, extent, line, scaleLinear } from 'd3'

import { withNumberDefault } from '../shared'
import { defaultTo, identity, ifElse, map, prop } from '../shared/fp'

import type { AreaChartPoint, FilledRegion } from './AreaChart.types'

type ChartExtent = [number, number]

export const AREA_CHART_MARGIN = {
  top: 20,
  right: 18,
  bottom: 36,
  left: 42,
}

export type RenderedAreaPoint = AreaChartPoint & {
  readonly cx: number
  readonly cy: number
}

export type AreaChartModel = {
  readonly plotBottom: number
  readonly points: readonly RenderedAreaPoint[]
  readonly baseline: number
  readonly baselineY: number
  readonly fillPath: string
  readonly linePath: string
  readonly xTicks: readonly number[]
  readonly yTicks: readonly number[]
  readonly xScale: (value: number) => number
  readonly yScale: (value: number) => number
}

const getExtent = (values: readonly number[]): ChartExtent => {
  const [lowerBound, upperBound] = extent(values)

  return [withNumberDefault(0)(lowerBound), withNumberDefault(1)(upperBound)]
}

const isZeroWidthExtent = ([lowerBound, upperBound]: ChartExtent) => lowerBound === upperBound

const expandZeroWidthExtent: (extent: ChartExtent) => ChartExtent = ifElse(
  isZeroWidthExtent,
  ([lowerBound, upperBound]: ChartExtent): ChartExtent => [lowerBound - 0.5, upperBound + 0.5],
  identity,
)

const renderLinePath = (points: readonly RenderedAreaPoint[]) =>
  defaultTo(
    '',
    line<RenderedAreaPoint>()
      .x((point) => point.cx)
      .y((point) => point.cy)(points),
  )

const renderFillPath = (baselineY: number) => (points: readonly RenderedAreaPoint[]) =>
  defaultTo(
    '',
    area<RenderedAreaPoint>()
      .x((point) => point.cx)
      .y0(baselineY)
      .y1((point) => point.cy)(points),
  )

const getXExtent = (points: readonly AreaChartPoint[]) =>
  expandZeroWidthExtent(getExtent(map(prop('x'), [...points])))

const getYExtent = (region: FilledRegion) =>
  expandZeroWidthExtent(getExtent([region.baseline, ...map(prop('y'), [...region.points])]))

export const buildAreaChartModel = (
  region: FilledRegion,
  width: number,
  height: number,
): AreaChartModel => {
  const plotBottom = height - AREA_CHART_MARGIN.bottom
  const xScale = scaleLinear()
    .domain(getXExtent(region.points))
    .nice()
    .range([AREA_CHART_MARGIN.left, width - AREA_CHART_MARGIN.right])
  const yScale = scaleLinear()
    .domain(getYExtent(region))
    .nice()
    .range([plotBottom, AREA_CHART_MARGIN.top])
  const baselineY = yScale(region.baseline)
  const toRenderedPoint = (point: AreaChartPoint): RenderedAreaPoint => ({
    ...point,
    cx: xScale(point.x),
    cy: yScale(point.y),
  })
  const renderedPoints = map(toRenderedPoint, [...region.points])

  return {
    plotBottom,
    points: renderedPoints,
    baseline: region.baseline,
    baselineY,
    fillPath: renderFillPath(baselineY)(renderedPoints),
    linePath: renderLinePath(renderedPoints),
    xTicks: xScale.ticks(Math.min(6, region.points.length)),
    yTicks: yScale.ticks(5),
    xScale,
    yScale,
  }
}
