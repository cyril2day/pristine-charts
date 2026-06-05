import type { RenderedVarianceEntry } from '../VarianceChart.model'
import type { VarianceChartProps } from '../VarianceChart.types'
import { always, ifElse } from '@/shared/fp'

type VarianceChartTooltipProps = Pick<
  VarianceChartProps,
  'displayMode' | 'formatPercentage' | 'formatValue' | 'formatVariance' | 'height' | 'width'
> & {
  readonly entry: RenderedVarianceEntry
}

const TOOLTIP_LINE_HEIGHT = 14
const TOOLTIP_PADDING_X = 8
const TOOLTIP_PADDING_Y = 6
const TOOLTIP_MIN_WIDTH = 88
const TOOLTIP_CHAR_WIDTH = 6.5
const VIEWBOX_PADDING = 4

const getDisplayedVariance = (
  entry: RenderedVarianceEntry,
  displayMode: VarianceChartProps['displayMode'],
  formatVariance: VarianceChartProps['formatVariance'],
  formatPercentage: VarianceChartProps['formatPercentage'],
) =>
  ifElse(
    (candidate: VarianceChartProps['displayMode']) => candidate === 'percentage',
    always(formatPercentage(entry.variancePercentage)),
    always(formatVariance(entry.variance)),
  )(displayMode)

const getTooltipWidth = (labels: readonly string[]) =>
  Math.max(
    TOOLTIP_MIN_WIDTH,
    Math.max(...labels.map((label) => label.length)) * TOOLTIP_CHAR_WIDTH + TOOLTIP_PADDING_X * 2,
  )

const getTooltipHeight = (labels: readonly string[]) =>
  labels.length * TOOLTIP_LINE_HEIGHT + TOOLTIP_PADDING_Y * 2

const clamp = (minimum: number, maximum: number, value: number) =>
  Math.min(Math.max(value, minimum), maximum)

export function VarianceChartTooltip({
  displayMode,
  entry,
  formatPercentage,
  formatValue,
  formatVariance,
  height,
  width,
}: VarianceChartTooltipProps) {
  const labels = [
    `${entry.category}: ${getDisplayedVariance(entry, displayMode, formatVariance, formatPercentage)}`,
    `Actual ${formatValue(entry.actualValue)}`,
    `Budget ${formatValue(entry.budgetValue)}`,
    entry.favourability,
  ]
  const tooltipWidth = getTooltipWidth(labels)
  const tooltipHeight = getTooltipHeight(labels)
  const x = clamp(
    VIEWBOX_PADDING,
    width - tooltipWidth - VIEWBOX_PADDING,
    entry.x + entry.width / 2 - tooltipWidth / 2,
  )
  const y = clamp(
    VIEWBOX_PADDING,
    height - tooltipHeight - VIEWBOX_PADDING,
    entry.valueY - tooltipHeight / 2,
  )

  return (
    <g className="pristine-variance-chart__tooltip" aria-hidden="true">
      <rect
        className="pristine-variance-chart__tooltip-background"
        x={x}
        y={y}
        width={tooltipWidth}
        height={tooltipHeight}
        rx={4}
      />
      {labels.map((label, index) => (
        <text
          className="pristine-variance-chart__tooltip-text"
          x={x + tooltipWidth / 2}
          y={y + TOOLTIP_PADDING_Y + TOOLTIP_LINE_HEIGHT * index + TOOLTIP_LINE_HEIGHT / 2}
          key={label}
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
    </g>
  )
}
