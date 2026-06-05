import { max, min, scaleBand, scaleLinear } from 'd3'

import { withNumberDefault } from '../shared'
import { always, cond, ifElse, map, prop } from '../shared/fp'

import type {
  Favourability,
  VarianceChartProps,
  VarianceDisplayMode,
  VarianceEntry,
} from './VarianceChart.types'

export const VARIANCE_CHART_MARGIN = {
  top: 24,
  right: 16,
  bottom: 42,
  left: 82,
}

export type RenderedVarianceEntry = VarianceEntry & {
  readonly displayValue: number
  readonly favourabilityClassName: string
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly valueY: number
}

export type VarianceChartModel = {
  readonly baselineY: number
  readonly plotBottom: number
  readonly yTicks: readonly number[]
  readonly entries: readonly RenderedVarianceEntry[]
  readonly yScale: (value: number) => number
}

const getDisplayValue = (displayMode: VarianceDisplayMode) => (entry: VarianceEntry) =>
  ifElse(
    (candidate: VarianceDisplayMode) => candidate === 'percentage',
    always(entry.variancePercentage),
    always(entry.variance),
  )(displayMode)

const getDisplayValues = (
  entries: readonly VarianceEntry[],
  displayMode: VarianceDisplayMode,
) => map(getDisplayValue(displayMode), [...entries])

const getMinValue = (
  entries: readonly VarianceEntry[],
  displayMode: VarianceDisplayMode,
) => withNumberDefault(0)(min(getDisplayValues(entries, displayMode)))

const getMaxValue = (
  entries: readonly VarianceEntry[],
  displayMode: VarianceDisplayMode,
) => withNumberDefault(0)(max(getDisplayValues(entries, displayMode)))

const getLowerDomain = (
  entries: readonly VarianceEntry[],
  displayMode: VarianceDisplayMode,
) => Math.min(0, getMinValue(entries, displayMode))

const getUpperDomain = (
  entries: readonly VarianceEntry[],
  displayMode: VarianceDisplayMode,
) => Math.max(0, getMaxValue(entries, displayMode))

const getCategory = (entry: VarianceEntry) => entry.category

const getFavourabilityClassName: (favourability: Favourability) => string = cond([
  [(candidate: Favourability) => candidate === 'Favourable', always('favourable')],
  [(candidate: Favourability) => candidate === 'Unfavourable', always('unfavourable')],
  [always(true), always('on-budget')],
])

const getValueY = (
  plotBottom: number,
  displayValue: number,
  y: number,
  height: number,
) =>
  ifElse(
    (candidate: number) => candidate < 0,
    always(Math.min(plotBottom - 6, y + height + 12)),
    always(Math.max(VARIANCE_CHART_MARGIN.top + 10, y - 6)),
  )(displayValue)

export const buildVarianceChartModel = (
  entries: readonly VarianceEntry[],
  width: number,
  height: number,
  displayMode: VarianceChartProps['displayMode'],
): VarianceChartModel => {
  const plotBottom = height - VARIANCE_CHART_MARGIN.bottom
  const xScale = scaleBand<string>()
    .domain(map(prop('category'), [...entries]))
    .range([VARIANCE_CHART_MARGIN.left, width - VARIANCE_CHART_MARGIN.right])
    .padding(0.22)
  const yScale = scaleLinear()
    .domain([getLowerDomain(entries, displayMode), getUpperDomain(entries, displayMode)])
    .nice()
    .range([plotBottom, VARIANCE_CHART_MARGIN.top])
  const baselineY = yScale(0)
  const toRenderedEntry = (entry: VarianceEntry): RenderedVarianceEntry => {
    const displayValue = getDisplayValue(displayMode)(entry)
    const y = Math.min(yScale(displayValue), baselineY)
    const entryHeight = Math.abs(baselineY - yScale(displayValue))

    return {
      ...entry,
      displayValue,
      favourabilityClassName: getFavourabilityClassName(entry.favourability),
      x: withNumberDefault(VARIANCE_CHART_MARGIN.left)(xScale(getCategory(entry))),
      y,
      width: xScale.bandwidth(),
      height: entryHeight,
      valueY: getValueY(plotBottom, displayValue, y, entryHeight),
    }
  }

  return {
    baselineY,
    plotBottom,
    yTicks: yScale.ticks(5),
    entries: map(toRenderedEntry, [...entries]),
    yScale,
  }
}
