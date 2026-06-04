import { useState } from 'react'

import type { PieDonutChartModel } from '../PieDonutChart.model'
import type { PieDonutChartProps } from '../PieDonutChart.types'

import { PieDonutChartLabels } from './PieDonutChartLabels'
import { PieDonutChartSlices } from './PieDonutChartSlices'
import { PieDonutChartTooltip } from './PieDonutChartTooltip'

type PieDonutChartSvgProps = Pick<
  PieDonutChartProps,
  'ariaLabel' | 'formatPercentage' | 'formatValue' | 'height' | 'showLabels' | 'width'
> & {
  readonly chart: PieDonutChartModel
}

export function PieDonutChartSvg({
  ariaLabel,
  chart,
  formatPercentage,
  formatValue,
  height,
  showLabels,
  width,
}: PieDonutChartSvgProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const activeArcs = chart.arcs.filter((arc) => arc.category === activeCategory)

  return (
    <svg
      className="pristine-pie-donut-chart__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <g transform={`translate(${chart.centerX} ${chart.centerY})`}>
        <PieDonutChartSlices
          activeCategory={activeCategory}
          chart={chart}
          formatPercentage={formatPercentage}
          formatValue={formatValue}
          onActivate={setActiveCategory}
          onDeactivate={() => setActiveCategory(null)}
        />
        <PieDonutChartLabels
          chart={chart}
          formatPercentage={formatPercentage}
          showLabels={showLabels}
        />
      </g>
      {activeArcs.map((arc) => (
        <PieDonutChartTooltip
          arc={arc}
          formatPercentage={formatPercentage}
          formatValue={formatValue}
          height={height}
          key={arc.category}
          width={width}
        />
      ))}
    </svg>
  )
}
