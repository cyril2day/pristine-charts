import { max } from 'd3'

import { fromNullable, matchOption, withNumberDefault } from '../shared'
import { always, ifElse, map, prop } from '../shared/fp'

import type { FunnelStage } from './FunnelChart.types'

export const FUNNEL_CHART_MARGIN = {
  top: 22,
  right: 132,
  bottom: 22,
  left: 120,
}

const STAGE_GAP = 4

export type RenderedFunnelStage = FunnelStage & {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly centerX: number
  readonly centerY: number
  readonly path: string
  readonly hitAreaX: number
  readonly hitAreaWidth: number
  readonly labelX: number
  readonly valueX: number
}

export type FunnelChartModel = {
  readonly stages: readonly RenderedFunnelStage[]
  readonly plotLeft: number
  readonly plotRight: number
  readonly plotTop: number
  readonly plotBottom: number
}

const getMaximumValue = (stages: readonly FunnelStage[]) =>
  withNumberDefault(0)(max(map(prop('value'), [...stages])))

const isZero = (value: number) => value === 0

const toScaledWidth = (plotWidth: number, maximumValue: number) => (value: number) =>
  ifElse(
    isZero,
    always(0),
    (candidate: number) => (value / candidate) * plotWidth,
  )(maximumValue)

const toPath = (
  centerX: number,
  y: number,
  height: number,
  topWidth: number,
  bottomWidth: number,
) => {
  const topLeft = centerX - topWidth / 2
  const topRight = centerX + topWidth / 2
  const bottomLeft = centerX - bottomWidth / 2
  const bottomRight = centerX + bottomWidth / 2

  return `M ${topLeft} ${y} L ${topRight} ${y} L ${bottomRight} ${y + height} L ${bottomLeft} ${y + height} Z`
}

const getNextStageValue = (stages: readonly FunnelStage[], stage: FunnelStage) =>
  matchOption(fromNullable(stages[stage.index + 1]), {
    none: () => stage.value,
    some: (nextStage) => nextStage.value,
  })

export const buildFunnelChartModel = (
  stages: readonly FunnelStage[],
  width: number,
  height: number,
): FunnelChartModel => {
  const plotLeft = FUNNEL_CHART_MARGIN.left
  const plotRight = width - FUNNEL_CHART_MARGIN.right
  const plotTop = FUNNEL_CHART_MARGIN.top
  const plotBottom = height - FUNNEL_CHART_MARGIN.bottom
  const plotWidth = plotRight - plotLeft
  const centerX = plotLeft + plotWidth / 2
  const totalGap = Math.max(0, stages.length - 1) * STAGE_GAP
  const stageHeight = (plotBottom - plotTop - totalGap) / stages.length
  const maximumValue = getMaximumValue(stages)
  const scaledWidth = toScaledWidth(plotWidth, maximumValue)
  const toRenderedStage = (stage: FunnelStage): RenderedFunnelStage => {
    const y = plotTop + stage.index * (stageHeight + STAGE_GAP)
    const topWidth = scaledWidth(stage.value)
    const bottomWidth = scaledWidth(getNextStageValue(stages, stage))
    const stageWidth = Math.max(topWidth, bottomWidth)

    return {
      ...stage,
      x: centerX - stageWidth / 2,
      y,
      width: stageWidth,
      height: stageHeight,
      centerX,
      centerY: y + stageHeight / 2,
      path: toPath(centerX, y, stageHeight, topWidth, bottomWidth),
      hitAreaX: plotLeft,
      hitAreaWidth: plotWidth,
      labelX: plotLeft - 12,
      valueX: plotRight + 12,
    }
  }

  return {
    stages: map(toRenderedStage, [...stages]),
    plotLeft,
    plotRight,
    plotTop,
    plotBottom,
  }
}
