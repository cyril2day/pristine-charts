import { matchOption } from '@/shared'

import type { RenderedFunnelStage } from '../FunnelChart.model'

type FunnelChartTooltipProps = {
  readonly stage: RenderedFunnelStage
  readonly formatValue: (value: number) => string
  readonly formatPercentage: (rate: number) => string
  readonly height: number
  readonly width: number
}

const TOOLTIP_HEIGHT = 22
const TOOLTIP_MIN_WIDTH = 64
const TOOLTIP_PADDING_X = 8
const TOOLTIP_CHAR_WIDTH = 7
const VIEWBOX_PADDING = 4

const getTooltipWidth = (label: string) =>
  Math.max(TOOLTIP_MIN_WIDTH, label.length * TOOLTIP_CHAR_WIDTH + TOOLTIP_PADDING_X * 2)

const clamp = (minimum: number, maximum: number, value: number) =>
  Math.min(Math.max(value, minimum), maximum)

const getTooltipLabel = (
  stage: RenderedFunnelStage,
  formatValue: (value: number) => string,
  formatPercentage: (rate: number) => string,
) =>
  matchOption(stage.dropOff, {
    none: () => `${stage.stage}: ${formatValue(stage.value)}`,
    some: (dropOff) =>
      `${stage.stage}: ${formatValue(stage.value)} | Drop-off ${formatValue(dropOff)} | ${matchOption(
        stage.dropOffRate,
        {
          none: () => '0%',
          some: formatPercentage,
        },
      )} lost`,
  })

export function FunnelChartTooltip({
  stage,
  formatValue,
  formatPercentage,
  height,
  width,
}: FunnelChartTooltipProps) {
  const label = getTooltipLabel(stage, formatValue, formatPercentage)
  const tooltipWidth = getTooltipWidth(label)
  const x = clamp(
    VIEWBOX_PADDING,
    width - tooltipWidth - VIEWBOX_PADDING,
    stage.centerX - tooltipWidth / 2,
  )
  const y = clamp(
    VIEWBOX_PADDING,
    height - TOOLTIP_HEIGHT - VIEWBOX_PADDING,
    stage.centerY - TOOLTIP_HEIGHT / 2,
  )

  return (
    <g className="pristine-funnel-chart__tooltip" aria-hidden="true">
      <rect
        className="pristine-funnel-chart__tooltip-background"
        x={x}
        y={y}
        width={tooltipWidth}
        height={TOOLTIP_HEIGHT}
        rx={4}
      />
      <text
        className="pristine-funnel-chart__tooltip-text"
        x={x + tooltipWidth / 2}
        y={y + TOOLTIP_HEIGHT / 2}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  )
}
