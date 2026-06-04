import { arc as createArc } from 'd3'

import { always, cond, defaultTo, ifElse } from '../shared/fp'

import type { Arc, DonutChartVariant, SegmentedWhole } from './PieDonutChart.types'

export const PIE_DONUT_CHART_MARGIN = {
  top: 28,
  right: 28,
  bottom: 28,
  left: 28,
}

const LABEL_GUTTER = 26 
const LABEL_GAP = 12
const MINIMUM_LABEL_PROPORTION = 0.04

type TextAnchor = 'start' | 'middle' | 'end'

export type RenderedArc = Arc & {
  readonly colorIndex: number
  readonly path: string
  readonly labelX: number
  readonly labelY: number
  readonly labelAnchor: TextAnchor
  readonly showLabel: boolean
  readonly tooltipX: number
  readonly tooltipY: number
}

export type PieDonutChartModel = {
  readonly arcs: readonly RenderedArc[]
  readonly centerX: number
  readonly centerY: number
  readonly innerRadius: number
  readonly outerRadius: number
  readonly total: number
  readonly variantKind: 'pie' | 'donut'
}

const getPlotWidth = (width: number) =>
  Math.max(0, width - PIE_DONUT_CHART_MARGIN.left - PIE_DONUT_CHART_MARGIN.right)

const getPlotHeight = (height: number) =>
  Math.max(0, height - PIE_DONUT_CHART_MARGIN.top - PIE_DONUT_CHART_MARGIN.bottom)

const getOuterRadius = (width: number, height: number) =>
  Math.max(0, Math.min(getPlotWidth(width), getPlotHeight(height)) / 2 - LABEL_GUTTER)

type DonutSegmentedWhole = SegmentedWhole & {
  readonly variant: DonutChartVariant
}

const isDonutWhole = (whole: SegmentedWhole): whole is DonutSegmentedWhole =>
  whole.variant.kind === 'donut'

const getInnerRadius = (whole: SegmentedWhole, outerRadius: number) =>
  ifElse(
    isDonutWhole,
    (candidate: DonutSegmentedWhole) => outerRadius * candidate.variant.innerRadius,
    always(0),
  )(whole)

const getPolarPoint = (radius: number, angle: number) => ({
  x: Math.sin(angle) * radius,
  y: -Math.cos(angle) * radius,
})

const getMidAngle = (arc: Arc) => (arc.startAngle + arc.endAngle) / 2

const isCloseToCenter = (x: number) => Math.abs(x) < 8

const getLabelAnchor: (x: number) => TextAnchor = cond([
  [isCloseToCenter, always('middle')],
  [(candidate: number) => candidate > 0, always('start')],
  [always(true), always('end')],
])

const renderArcPath = (innerRadius: number, outerRadius: number) => (arc: Arc) =>
  defaultTo(
    '',
    createArc<Arc>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle((segment) => segment.startAngle)
      .endAngle((segment) => segment.endAngle)(arc),
  )

export const buildPieDonutChartModel = (
  whole: SegmentedWhole,
  width: number,
  height: number,
): PieDonutChartModel => {
  const centerX = width / 2
  const centerY = height / 2
  const outerRadius = getOuterRadius(width, height)
  const innerRadius = getInnerRadius(whole, outerRadius)
  const arcPath = renderArcPath(innerRadius, outerRadius)
  const toRenderedArc = (arc: Arc, index: number): RenderedArc => {
    const midAngle = getMidAngle(arc)
    const labelPoint = getPolarPoint(outerRadius + LABEL_GAP, midAngle)
    const tooltipPoint = getPolarPoint((innerRadius + outerRadius) / 2, midAngle)

    return {
      ...arc,
      colorIndex: index % 8,
      path: arcPath(arc),
      labelX: labelPoint.x,
      labelY: labelPoint.y,
      labelAnchor: getLabelAnchor(labelPoint.x),
      showLabel: arc.proportion >= MINIMUM_LABEL_PROPORTION,
      tooltipX: centerX + tooltipPoint.x,
      tooltipY: centerY + tooltipPoint.y,
    }
  }

  return {
    arcs: whole.arcs.map(toRenderedArc),
    centerX,
    centerY,
    innerRadius,
    outerRadius,
    total: whole.total,
    variantKind: whole.variant.kind,
  }
}
