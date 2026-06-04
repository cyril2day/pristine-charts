import { useState } from 'react'

import type { BarChartModel } from '../BarChart.model'
import type { BarChartProps } from '../BarChart.types'

import { BarChartAxes } from './BarChartAxes'
import { BarChartCategories } from './BarChartCategories'
import { BarChartGridLines } from './BarChartGridLines'
import { BarChartPlotArea } from './BarChartPlotArea'
import { BarChartTooltip } from './BarChartTooltip'

type BarChartSvgProps = Pick<BarChartProps, 'ariaLabel' | 'formatValue' | 'height' | 'showValues' | 'width'> & {
  readonly chart: BarChartModel
}

export function BarChartSvg({
  ariaLabel,
  chart,
  formatValue,
  height,
  showValues,
  width,
}: BarChartSvgProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const activeBars = chart.bars.filter((bar) => bar.category === activeCategory)

  return (
    <svg
      className="pristine-bar-chart__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <BarChartPlotArea chart={chart} width={width} />
      <BarChartGridLines chart={chart} width={width} />
      <BarChartAxes chart={chart} width={width} />
      <BarChartCategories
        activeCategory={activeCategory}
        chart={chart}
        formatValue={formatValue}
        height={height}
        onActivate={setActiveCategory}
        onDeactivate={() => setActiveCategory(null)}
        showValues={showValues}
      />
      {activeBars.map((bar) => (
        <BarChartTooltip
          key={bar.category}
          bar={bar}
          formatValue={formatValue}
          height={height}
          width={width}
        />
      ))}
    </svg>
  )
}
