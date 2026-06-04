import { extent, scaleLinear } from 'd3'

import { withNumberDefault } from '../shared'
import { identity, ifElse, map, prop } from '../shared/fp'

import type { ScatterPlotDot } from './ScatterPlot.types'

type ChartExtent = [number, number]

export const SCATTER_PLOT_MARGIN = {
  top: 20,
  right: 18,
  bottom: 36,
  left: 42,
}

export type RenderedScatterPlotDot = ScatterPlotDot & {
  readonly cx: number
  readonly cy: number
}

export type ScatterPlotModel = {
  readonly plotBottom: number
  readonly dots: readonly RenderedScatterPlotDot[]
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

const getXExtent = (dots: readonly ScatterPlotDot[]) =>
  expandZeroWidthExtent(getExtent(map(prop('x'), [...dots])))

const getYExtent = (dots: readonly ScatterPlotDot[]) =>
  expandZeroWidthExtent(getExtent(map(prop('y'), [...dots])))

export const buildScatterPlotModel = (
  dots: readonly ScatterPlotDot[],
  width: number,
  height: number,
): ScatterPlotModel => {
  const plotBottom = height - SCATTER_PLOT_MARGIN.bottom
  const xScale = scaleLinear()
    .domain(getXExtent(dots))
    .nice()
    .range([SCATTER_PLOT_MARGIN.left, width - SCATTER_PLOT_MARGIN.right])
  const yScale = scaleLinear()
    .domain(getYExtent(dots))
    .nice()
    .range([plotBottom, SCATTER_PLOT_MARGIN.top])
  const toRenderedDot = (dot: ScatterPlotDot): RenderedScatterPlotDot => ({
    ...dot,
    cx: xScale(dot.x),
    cy: yScale(dot.y),
  })

  return {
    plotBottom,
    dots: map(toRenderedDot, [...dots]),
    xTicks: xScale.ticks(Math.min(6, dots.length)),
    yTicks: yScale.ticks(5),
    xScale,
    yScale,
  }
}
