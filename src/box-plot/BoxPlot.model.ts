import { extent, scaleLinear } from 'd3'

import { withNumberDefault } from '../shared'
import { identity, ifElse } from '../shared/fp'

import type { FiveNumberSummary } from './BoxPlot.types'

type ChartExtent = [number, number]

export const BOX_PLOT_MARGIN = {
  top: 24,
  right: 20,
  bottom: 36,
  left: 42,
}

export type RenderedBoxPlotPart = {
  readonly key: string
  readonly label: string
  readonly tooltipX: number
  readonly tooltipY: number
}

export type RenderedOutlier = RenderedBoxPlotPart & {
  readonly value: number
  readonly cx: number
  readonly cy: number
}

export type BoxPlotModel = {
  readonly plotBottom: number
  readonly plotCenter: number
  readonly boxTop: number
  readonly boxHeight: number
  readonly q1X: number
  readonly medianX: number
  readonly q3X: number
  readonly lowerWhiskerX: number
  readonly upperWhiskerX: number
  readonly lowerCapTop: number
  readonly lowerCapBottom: number
  readonly upperCapTop: number
  readonly upperCapBottom: number
  readonly boxPart: RenderedBoxPlotPart
  readonly medianPart: RenderedBoxPlotPart
  readonly lowerWhiskerPart: RenderedBoxPlotPart
  readonly upperWhiskerPart: RenderedBoxPlotPart
  readonly outliers: readonly RenderedOutlier[]
  readonly parts: readonly RenderedBoxPlotPart[]
  readonly xTicks: readonly number[]
  readonly xScale: (value: number) => number
}

const BOX_HEIGHT = 56
const WHISKER_CAP_HEIGHT = 38
const DOMAIN_PADDING_RATIO = 0.08

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

const padExtent = ([lowerBound, upperBound]: ChartExtent): ChartExtent => {
  const width = upperBound - lowerBound
  const padding = width * DOMAIN_PADDING_RATIO

  return [lowerBound - padding, upperBound + padding]
}

const getSummaryValues = (summary: FiveNumberSummary) => [
  summary.lowerWhisker,
  summary.q1,
  summary.median,
  summary.q3,
  summary.upperWhisker,
  ...summary.outliers,
]

const createPart = (
  key: string,
  label: string,
  tooltipX: number,
  tooltipY: number,
): RenderedBoxPlotPart => ({
  key,
  label,
  tooltipX,
  tooltipY,
})

export const buildBoxPlotModel = (
  summary: FiveNumberSummary,
  width: number,
  height: number,
  formatValue: (value: number) => string,
): BoxPlotModel => {
  const plotBottom = height - BOX_PLOT_MARGIN.bottom
  const plotCenter = BOX_PLOT_MARGIN.top + (plotBottom - BOX_PLOT_MARGIN.top) / 2
  const boxTop = plotCenter - BOX_HEIGHT / 2
  const xScale = scaleLinear()
    .domain(padExtent(expandZeroWidthExtent(getExtent(getSummaryValues(summary)))))
    .nice()
    .range([BOX_PLOT_MARGIN.left, width - BOX_PLOT_MARGIN.right])
  const q1X = xScale(summary.q1)
  const medianX = xScale(summary.median)
  const q3X = xScale(summary.q3)
  const lowerWhiskerX = xScale(summary.lowerWhisker)
  const upperWhiskerX = xScale(summary.upperWhisker)
  const lowerCapTop = plotCenter - WHISKER_CAP_HEIGHT / 2
  const lowerCapBottom = plotCenter + WHISKER_CAP_HEIGHT / 2
  const upperCapTop = lowerCapTop
  const upperCapBottom = lowerCapBottom
  const boxPart = createPart(
    'box',
    `Q1 ${formatValue(summary.q1)} to Q3 ${formatValue(summary.q3)}`,
    q1X + (q3X - q1X) / 2,
    boxTop,
  )
  const medianPart = createPart(
    'median',
    `Median: ${formatValue(summary.median)}`,
    medianX,
    boxTop,
  )
  const lowerWhiskerPart = createPart(
    'lower-whisker',
    `Lower whisker: ${formatValue(summary.lowerWhisker)}`,
    lowerWhiskerX,
    plotCenter,
  )
  const upperWhiskerPart = createPart(
    'upper-whisker',
    `Upper whisker: ${formatValue(summary.upperWhisker)}`,
    upperWhiskerX,
    plotCenter,
  )
  const outliers = summary.outliers.map(
    (value, index): RenderedOutlier => ({
      ...createPart(
        `outlier-${String(index)}`,
        `Outlier: ${formatValue(value)}`,
        xScale(value),
        plotCenter,
      ),
      value,
      cx: xScale(value),
      cy: plotCenter,
    }),
  )

  return {
    plotBottom,
    plotCenter,
    boxTop,
    boxHeight: BOX_HEIGHT,
    q1X,
    medianX,
    q3X,
    lowerWhiskerX,
    upperWhiskerX,
    lowerCapTop,
    lowerCapBottom,
    upperCapTop,
    upperCapBottom,
    boxPart,
    medianPart,
    lowerWhiskerPart,
    upperWhiskerPart,
    outliers,
    parts: [boxPart, medianPart, lowerWhiskerPart, upperWhiskerPart, ...outliers],
    xTicks: xScale.ticks(6),
    xScale,
  }
}
