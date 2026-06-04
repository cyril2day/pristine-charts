import { extent, line, scaleLinear } from 'd3'

import { withNumberDefault } from '../shared'
import { always, defaultTo, identity, ifElse, map, prop } from '../shared/fp'

import type { LineChartPoint, LineSegment } from './LineChart.types'

type ChartExtent = [number, number]

export const LINE_CHART_MARGIN = {
  top: 20,
  right: 18,
  bottom: 36,
  left: 42,
}

export type RenderedLinePoint = LineChartPoint & {
  readonly cx: number
  readonly cy: number
}

export type RenderedLineSegment = {
  readonly start: RenderedLinePoint
  readonly end: RenderedLinePoint
}

export type LineChartModel = {
  readonly plotBottom: number
  readonly points: readonly RenderedLinePoint[]
  readonly segments: readonly RenderedLineSegment[]
  readonly path: string
  readonly xTicks: readonly number[]
  readonly yTicks: readonly number[]
  readonly xScale: (value: number) => number
  readonly yScale: (value: number) => number
}

const isFirstSegmentIndex = (index: number) => index === 0

const getPointsForSegment = (segment: LineSegment) => (index: number) =>
  ifElse(
    isFirstSegmentIndex,
    always([segment.start, segment.end]),
    always([segment.end]),
  )(index)

const getPointsFromSegments = (segments: readonly LineSegment[]) =>
  segments.flatMap((segment, index) => getPointsForSegment(segment)(index))

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

const renderLinePath = (points: readonly RenderedLinePoint[]) =>
  defaultTo(
    '',
    line<RenderedLinePoint>()
      .x((point) => point.cx)
      .y((point) => point.cy)(points),
  )

const getXExtent = (points: readonly LineChartPoint[]) =>
  expandZeroWidthExtent(getExtent(map(prop('x'), [...points])))

const getYExtent = (points: readonly LineChartPoint[]) =>
  expandZeroWidthExtent(getExtent(map(prop('y'), [...points])))

export const buildLineChartModel = (
  segments: readonly LineSegment[],
  width: number,
  height: number,
): LineChartModel => {
  const plotBottom = height - LINE_CHART_MARGIN.bottom
  const points = getPointsFromSegments(segments)
  const xScale = scaleLinear()
    .domain(getXExtent(points))
    .nice()
    .range([LINE_CHART_MARGIN.left, width - LINE_CHART_MARGIN.right])
  const yScale = scaleLinear()
    .domain(getYExtent(points))
    .nice()
    .range([plotBottom, LINE_CHART_MARGIN.top])
  const toRenderedPoint = (point: LineChartPoint): RenderedLinePoint => ({
    ...point,
    cx: xScale(point.x),
    cy: yScale(point.y),
  })
  const renderedPoints = map(toRenderedPoint, [...points])
  const renderedPath = renderLinePath(renderedPoints)
  const toRenderedSegment = (segment: LineSegment): RenderedLineSegment => ({
    start: toRenderedPoint(segment.start),
    end: toRenderedPoint(segment.end),
  })

  return {
    plotBottom,
    points: renderedPoints,
    segments: map(toRenderedSegment, [...segments]),
    path: renderedPath,
    xTicks: xScale.ticks(Math.min(6, points.length)),
    yTicks: yScale.ticks(5),
    xScale,
    yScale,
  }
}
