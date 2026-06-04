import type { RenderedArc } from '../PieDonutChart.model'

type PieDonutChartTooltipProps = {
  readonly arc: RenderedArc
  readonly formatPercentage: (proportion: number) => string
  readonly formatValue: (value: number) => string
  readonly height: number
  readonly width: number
}

const TOOLTIP_HEIGHT = 22
const TOOLTIP_MIN_WIDTH = 44
const TOOLTIP_PADDING_X = 8
const TOOLTIP_CHAR_WIDTH = 7
const VIEWBOX_PADDING = 4

const getTooltipWidth = (label: string) =>
  Math.max(TOOLTIP_MIN_WIDTH, label.length * TOOLTIP_CHAR_WIDTH + TOOLTIP_PADDING_X * 2)

const clamp = (minimum: number, maximum: number, value: number) =>
  Math.min(Math.max(value, minimum), maximum)

export function PieDonutChartTooltip({
  arc,
  formatPercentage,
  formatValue,
  height,
  width,
}: PieDonutChartTooltipProps) {
  const label = `${arc.category}: ${formatValue(arc.value)} (${formatPercentage(arc.proportion)})`
  const tooltipWidth = getTooltipWidth(label)
  const x = clamp(
    VIEWBOX_PADDING,
    width - tooltipWidth - VIEWBOX_PADDING,
    arc.tooltipX - tooltipWidth / 2,
  )
  const y = clamp(
    VIEWBOX_PADDING,
    height - TOOLTIP_HEIGHT - VIEWBOX_PADDING,
    arc.tooltipY - TOOLTIP_HEIGHT / 2,
  )

  return (
    <g className="pristine-pie-donut-chart__tooltip" aria-hidden="true">
      <rect
        className="pristine-pie-donut-chart__tooltip-background"
        x={x}
        y={y}
        width={tooltipWidth}
        height={TOOLTIP_HEIGHT}
        rx={4}
      />
      <text
        className="pristine-pie-donut-chart__tooltip-text"
        x={x + tooltipWidth / 2}
        y={y + TOOLTIP_HEIGHT / 2}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  )
}
