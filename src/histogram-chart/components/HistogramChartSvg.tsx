import { useState } from 'react'

import type { HistogramChartModel } from '../HistogramChart.model'
import type { HistogramChartProps } from '../HistogramChart.types'

import { HistogramChartAxes } from './HistogramChartAxes'
import { HistogramChartBins } from './HistogramChartBins'
import { HistogramChartGridLines } from './HistogramChartGridLines'
import { HistogramChartPlotArea } from './HistogramChartPlotArea'
import { HistogramChartTooltip } from './HistogramChartTooltip'
import { HistogramChartXTicks } from './HistogramChartXTicks'

type HistogramChartSvgProps = Pick<HistogramChartProps, 'ariaLabel' | 'height' | 'showCounts' | 'width'> & {
  readonly chart: HistogramChartModel
}

const getBinKey = (bar: HistogramChartModel['bars'][number]) =>
  `${bar.lowerBound}:${bar.upperBound}`

export function HistogramChartSvg({
  ariaLabel,
  chart,
  height,
  showCounts,
  width,
}: HistogramChartSvgProps) {
  const [activeBin, setActiveBin] = useState<string | null>(null)
  const activeBars = chart.bars.filter((bar) => getBinKey(bar) === activeBin)

  return (
    <svg
      className="pristine-histogram-chart__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <HistogramChartPlotArea chart={chart} width={width} />
      <HistogramChartGridLines chart={chart} width={width} />
      <HistogramChartAxes chart={chart} width={width} />
      <HistogramChartBins
        activeBin={activeBin}
        chart={chart}
        onActivate={setActiveBin}
        onDeactivate={() => setActiveBin(null)}
        showCounts={showCounts}
      />
      <HistogramChartXTicks chart={chart} height={height} />
      {activeBars.map((bar) => (
        <HistogramChartTooltip
          key={getBinKey(bar)}
          bar={bar}
          height={height}
          width={width}
        />
      ))}
    </svg>
  )
}
