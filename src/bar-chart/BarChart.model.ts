import { max, min, scaleBand, scaleLinear } from 'd3'

import { withNumberDefault } from '../shared'
import { always, ifElse, map, prop } from '../shared/fp'

import type { Bar } from './BarChart.types'

export const BAR_CHART_MARGIN = {
  top: 24,
  right: 16,
  bottom: 42,
  left: 42,
}

export type RenderedBar = Bar & {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly valueY: number
}

export type BarChartModel = {
  readonly baselineY: number
  readonly plotBottom: number
  readonly yTicks: readonly number[]
  readonly bars: readonly RenderedBar[]
  readonly yScale: (value: number) => number
}

const getMinValue = (bars: readonly Bar[]) =>
  withNumberDefault(0)(min(map(prop('value'), [...bars])))

const getMaxValue = (bars: readonly Bar[]) =>
  withNumberDefault(0)(max(map(prop('value'), [...bars])))

const getLowerDomain = (bars: readonly Bar[]) => Math.min(0, getMinValue(bars))

const getUpperDomain = (bars: readonly Bar[]) => Math.max(0, getMaxValue(bars))

const getCategory = (bar: Bar) => bar.category

const getValueY = (plotBottom: number) => (bar: Bar, y: number, height: number) =>
  ifElse(
    (candidate: Bar) => candidate.direction === 'negative',
    always(Math.min(plotBottom - 6, y + height + 12)),
    always(Math.max(BAR_CHART_MARGIN.top + 10, y - 6)),
  )(bar)

export const buildBarChartModel = (
  bars: readonly Bar[],
  width: number,
  height: number,
): BarChartModel => {
  const plotBottom = height - BAR_CHART_MARGIN.bottom
  const xScale = scaleBand<string>()
    .domain(map(getCategory, [...bars]))
    .range([BAR_CHART_MARGIN.left, width - BAR_CHART_MARGIN.right])
    .padding(0.22)
  const yScale = scaleLinear()
    .domain([getLowerDomain(bars), getUpperDomain(bars)])
    .nice()
    .range([plotBottom, BAR_CHART_MARGIN.top])
  const baselineY = yScale(0)
  const toRenderedBar = (bar: Bar): RenderedBar => {
    const y = Math.min(yScale(bar.value), baselineY)
    const barHeight = Math.abs(baselineY - yScale(bar.value))

    return {
      ...bar,
      x: withNumberDefault(BAR_CHART_MARGIN.left)(xScale(bar.category)),
      y,
      width: xScale.bandwidth(),
      height: barHeight,
      valueY: getValueY(plotBottom)(bar, y, barHeight),
    }
  }

  return {
    baselineY,
    plotBottom,
    yTicks: yScale.ticks(5),
    bars: map(toRenderedBar, [...bars]),
    yScale,
  }
}
