import type { RenderedBoxPlotPart } from '../BoxPlot.model'

type BoxPlotTooltipProps = {
  readonly height: number
  readonly part: RenderedBoxPlotPart
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

export function BoxPlotTooltip({
  height,
  part,
  width,
}: BoxPlotTooltipProps) {
  const tooltipWidth = getTooltipWidth(part.label)
  const x = clamp(
    VIEWBOX_PADDING,
    width - tooltipWidth - VIEWBOX_PADDING,
    part.tooltipX - tooltipWidth / 2,
  )
  const y = clamp(
    VIEWBOX_PADDING,
    height - TOOLTIP_HEIGHT - VIEWBOX_PADDING,
    part.tooltipY - TOOLTIP_HEIGHT - 10,
  )

  return (
    <g className="pristine-box-plot__tooltip" aria-hidden="true">
      <rect
        className="pristine-box-plot__tooltip-background"
        x={x}
        y={y}
        width={tooltipWidth}
        height={TOOLTIP_HEIGHT}
        rx={4}
      />
      <text
        className="pristine-box-plot__tooltip-text"
        x={x + tooltipWidth / 2}
        y={y + TOOLTIP_HEIGHT / 2}
        textAnchor="middle"
      >
        {part.label}
      </text>
    </g>
  )
}
