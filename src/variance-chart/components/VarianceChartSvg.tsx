import { useState } from 'react'

import type { VarianceChartModel } from '../VarianceChart.model'
import type { VarianceChartProps } from '../VarianceChart.types'

import { VarianceChartAxes } from './VarianceChartAxes'
import { VarianceChartEntries } from './VarianceChartEntries'
import { VarianceChartGridLines } from './VarianceChartGridLines'
import { VarianceChartPlotArea } from './VarianceChartPlotArea'
import { VarianceChartTooltip } from './VarianceChartTooltip'

type VarianceChartSvgProps = Pick<
  VarianceChartProps,
  | 'ariaLabel'
  | 'displayMode'
  | 'formatPercentage'
  | 'formatValue'
  | 'formatVariance'
  | 'height'
  | 'showValues'
  | 'width'
> & {
  readonly chart: VarianceChartModel
}

export function VarianceChartSvg({
  ariaLabel,
  chart,
  displayMode,
  formatPercentage,
  formatValue,
  formatVariance,
  height,
  showValues,
  width,
}: VarianceChartSvgProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const activeEntries = chart.entries.filter((entry) => entry.category === activeCategory)

  return (
    <svg
      className="pristine-variance-chart__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <VarianceChartPlotArea chart={chart} width={width} />
      <VarianceChartGridLines
        chart={chart}
        displayMode={displayMode}
        formatPercentage={formatPercentage}
        formatVariance={formatVariance}
        width={width}
      />
      <VarianceChartAxes chart={chart} width={width} />
      <VarianceChartEntries
        activeCategory={activeCategory}
        chart={chart}
        displayMode={displayMode}
        formatPercentage={formatPercentage}
        formatValue={formatValue}
        formatVariance={formatVariance}
        height={height}
        onActivate={setActiveCategory}
        onDeactivate={() => setActiveCategory(null)}
        showValues={showValues}
      />
      {activeEntries.map((entry) => (
        <VarianceChartTooltip
          displayMode={displayMode}
          entry={entry}
          formatPercentage={formatPercentage}
          formatValue={formatValue}
          formatVariance={formatVariance}
          height={height}
          key={entry.category}
          width={width}
        />
      ))}
    </svg>
  )
}
