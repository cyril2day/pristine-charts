import type { RenderedBar } from '../BarChart.model'

type BarChartTooltipProps = {
  readonly bar: RenderedBar
  readonly formatValue: (value: number) => string
  readonly height: number
  readonly width: number
}

const TOOLTIP_HEIGHT = 22
const TOOLTIP_MIN_WIDTH = 30
const TOOLTIP_PADDING_X = 8
const TOOLTIP_CHAR_WIDTH = 7
const VIEWBOX_PADDING = 4

const getTooltipWidth = (label: string) =>
  Math.max(TOOLTIP_MIN_WIDTH, label.length * TOOLTIP_CHAR_WIDTH + TOOLTIP_PADDING_X * 2)

const clamp = (minimum: number, maximum: number, value: number) =>
  Math.min(Math.max(value, minimum), maximum)

export function BarChartTooltip({
  bar,
  formatValue,
  height,
  width,
}: BarChartTooltipProps) {
  const label = formatValue(bar.value)
  const tooltipWidth = getTooltipWidth(label)
  const x = clamp(
    VIEWBOX_PADDING,
    width - tooltipWidth - VIEWBOX_PADDING,
    bar.x + bar.width / 2 - tooltipWidth / 2,
  )
  const y = clamp(
    VIEWBOX_PADDING,
    height - TOOLTIP_HEIGHT - VIEWBOX_PADDING,
    bar.valueY - TOOLTIP_HEIGHT / 2,
  )

  return (
    <g className="pristine-bar-chart__tooltip" aria-hidden="true">
      <rect
        className="pristine-bar-chart__tooltip-background"
        x={x}
        y={y}
        width={tooltipWidth}
        height={TOOLTIP_HEIGHT}
        rx={4}
      />
      <text
        className="pristine-bar-chart__tooltip-text"
        x={x + tooltipWidth / 2}
        y={y + TOOLTIP_HEIGHT / 2}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  )
}
