import type { RenderedVarianceEntry } from '../VarianceChart.model'
import type { VarianceChartProps } from '../VarianceChart.types'
import { always, ifElse } from '@/shared/fp'

type VarianceChartValueLabelProps = Pick<
  VarianceChartProps,
  'displayMode' | 'formatPercentage' | 'formatVariance'
> & {
  readonly entry: RenderedVarianceEntry
}

const getLabel = (
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

export function VarianceChartValueLabel({
  displayMode,
  entry,
  formatPercentage,
  formatVariance,
}: VarianceChartValueLabelProps) {
  return (
    <text
      className="pristine-variance-chart__value"
      x={entry.x + entry.width / 2}
      y={entry.valueY}
      textAnchor="middle"
    >
      {getLabel(entry, displayMode, formatVariance, formatPercentage)}
    </text>
  )
}
