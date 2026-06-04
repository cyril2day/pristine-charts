import { max, scaleLinear } from 'd3'

import { withNumberDefault } from '../shared'
import { head, last, map, prop } from '../shared/fp'

import type { HistogramBin } from './HistogramChart.types'

export const HISTOGRAM_CHART_MARGIN = {
  top: 20,
  right: 16,
  bottom: 32,
  left: 32,
}

export type RenderedHistogramBin = HistogramBin & {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly label: string
}

export type HistogramChartModel = {
  readonly plotBottom: number
  readonly xTicks: readonly number[]
  readonly yTicks: readonly number[]
  readonly bars: readonly RenderedHistogramBin[]
  readonly xScale: (value: number) => number
  readonly yScale: (value: number) => number
}

const getFirstLowerBound = (bins: readonly HistogramBin[]) =>
  withNumberDefault(0)(head([...bins])?.lowerBound)

const getLastUpperBound = (bins: readonly HistogramBin[]) =>
  withNumberDefault(1)(last([...bins])?.upperBound)

const getMaxCount = (bins: readonly HistogramBin[]) =>
  withNumberDefault(0)(max(map(prop('count'), [...bins])))

export const buildHistogramChartModel = (
  bins: readonly HistogramBin[],
  width: number,
  height: number,
  formatBinLabel: (bin: HistogramBin) => string,
): HistogramChartModel => {
  const plotBottom = height - HISTOGRAM_CHART_MARGIN.bottom
  const xScale = scaleLinear()
    .domain([getFirstLowerBound(bins), getLastUpperBound(bins)])
    .range([HISTOGRAM_CHART_MARGIN.left, width - HISTOGRAM_CHART_MARGIN.right])
  const yScale = scaleLinear()
    .domain([0, getMaxCount(bins)])
    .nice()
    .range([plotBottom, HISTOGRAM_CHART_MARGIN.top])
  const toBar = (bin: HistogramBin): RenderedHistogramBin => {
    const x = xScale(bin.lowerBound)
    const barWidth = Math.max(0, xScale(bin.upperBound) - x)
    const y = yScale(bin.count)

    return {
      ...bin,
      x,
      y,
      width: barWidth,
      height: plotBottom - y,
      label: formatBinLabel(bin),
    }
  }

  return {
    plotBottom,
    xTicks: xScale.ticks(Math.min(6, bins.length + 1)),
    yTicks: yScale.ticks(4),
    bars: map(toBar, [...bins]),
    xScale,
    yScale,
  }
}
