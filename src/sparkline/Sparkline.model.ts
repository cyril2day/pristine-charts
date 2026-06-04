import { extent, line, scaleLinear } from 'd3'

import { withNumberDefault } from '../shared'
import { always, defaultTo, identity, ifElse, map, prop } from '../shared/fp'

import type { SparklinePoint, SparklineSegment } from './Sparkline.types'

type ChartExtent = [number, number]

export const SPARKLINE_PADDING = {
  top: 4,
  right: 4,
  bottom: 4,
  left: 4,
}

export type RenderedSparklinePoint = SparklinePoint & {
  readonly cx: number
  readonly cy: number
}

export type RenderedSparklineSegment = {
  readonly start: RenderedSparklinePoint
  readonly end: RenderedSparklinePoint
}

export type SparklineModel = {
  readonly points: readonly RenderedSparklinePoint[]
  readonly segments: readonly RenderedSparklineSegment[]
  readonly path: string
}

const isFirstSegmentIndex = (index: number) => index === 0

const getPointsForSegment = (segment: SparklineSegment) => (index: number) =>
  ifElse(
    isFirstSegmentIndex,
    always([segment.start, segment.end]),
    always([segment.end]),
  )(index)

const getPointsFromSegments = (segments: readonly SparklineSegment[]) =>
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

const renderSparklinePath = (points: readonly RenderedSparklinePoint[]) =>
  defaultTo(
    '',
    line<RenderedSparklinePoint>()
      .x((point) => point.cx)
      .y((point) => point.cy)(points),
  )

const getXExtent = (points: readonly SparklinePoint[]) =>
  expandZeroWidthExtent(getExtent(map(prop('x'), [...points])))

const getYExtent = (points: readonly SparklinePoint[]) =>
  expandZeroWidthExtent(getExtent(map(prop('y'), [...points])))

export const buildSparklineModel = (
  segments: readonly SparklineSegment[],
  width: number,
  height: number,
): SparklineModel => {
  const points = getPointsFromSegments(segments)
  const xScale = scaleLinear()
    .domain(getXExtent(points))
    .range([SPARKLINE_PADDING.left, width - SPARKLINE_PADDING.right])
  const yScale = scaleLinear()
    .domain(getYExtent(points))
    .range([height - SPARKLINE_PADDING.bottom, SPARKLINE_PADDING.top])
  const toRenderedPoint = (point: SparklinePoint): RenderedSparklinePoint => ({
    ...point,
    cx: xScale(point.x),
    cy: yScale(point.y),
  })
  const renderedPoints = map(toRenderedPoint, [...points])
  const toRenderedSegment = (segment: SparklineSegment): RenderedSparklineSegment => ({
    start: toRenderedPoint(segment.start),
    end: toRenderedPoint(segment.end),
  })

  return {
    points: renderedPoints,
    segments: map(toRenderedSegment, [...segments]),
    path: renderSparklinePath(renderedPoints),
  }
}
