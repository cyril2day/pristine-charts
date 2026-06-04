import type { RenderedScatterPlotDot } from '../ScatterPlot.model'

type ScatterPlotTooltipProps = {
  readonly dot: RenderedScatterPlotDot
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
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

export function ScatterPlotTooltip({
  dot,
  formatXValue,
  formatYValue,
  height,
  width,
}: ScatterPlotTooltipProps) {
  const label = `${formatXValue(dot.x)}: ${formatYValue(dot.y)}`
  const tooltipWidth = getTooltipWidth(label)
  const x = clamp(
    VIEWBOX_PADDING,
    width - tooltipWidth - VIEWBOX_PADDING,
    dot.cx - tooltipWidth / 2,
  )
  const y = clamp(
    VIEWBOX_PADDING,
    height - TOOLTIP_HEIGHT - VIEWBOX_PADDING,
    dot.cy - TOOLTIP_HEIGHT - 10,
  )

  return (
    <g className="pristine-scatter-plot__tooltip" aria-hidden="true">
      <rect
        className="pristine-scatter-plot__tooltip-background"
        x={x}
        y={y}
        width={tooltipWidth}
        height={TOOLTIP_HEIGHT}
        rx={4}
      />
      <text
        className="pristine-scatter-plot__tooltip-text"
        x={x + tooltipWidth / 2}
        y={y + TOOLTIP_HEIGHT / 2}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  )
}
