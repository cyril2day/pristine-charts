import type { VarianceChartModel } from '../VarianceChart.model'
import type { VarianceChartProps } from '../VarianceChart.types'

import { VarianceChartEntry } from './VarianceChartEntry'

type VarianceChartEntriesProps = Pick<
  VarianceChartProps,
  | 'displayMode'
  | 'formatPercentage'
  | 'formatValue'
  | 'formatVariance'
  | 'showValues'
> & {
  readonly activeCategory: string | null
  readonly chart: VarianceChartModel
  readonly height: number
  readonly onActivate: (category: string) => void
  readonly onDeactivate: () => void
}

export function VarianceChartEntries({
  activeCategory,
  chart,
  displayMode,
  formatPercentage,
  formatValue,
  formatVariance,
  height,
  onActivate,
  onDeactivate,
  showValues,
}: VarianceChartEntriesProps) {
  return chart.entries.map((entry) => (
    <VarianceChartEntry
      active={activeCategory === entry.category}
      displayMode={displayMode}
      entry={entry}
      formatPercentage={formatPercentage}
      formatValue={formatValue}
      formatVariance={formatVariance}
      height={height}
      key={entry.category}
      onActivate={() => onActivate(entry.category)}
      onDeactivate={onDeactivate}
      showValues={showValues}
    />
  ))
}
