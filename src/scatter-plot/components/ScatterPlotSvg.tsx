import { useState } from 'react'

import type { ScatterPlotModel } from '../ScatterPlot.model'
import type { ScatterPlotProps } from '../ScatterPlot.types'

import { ScatterPlotAxes } from './ScatterPlotAxes'
import { ScatterPlotDots } from './ScatterPlotDots'
import { ScatterPlotGridLines } from './ScatterPlotGridLines'
import { ScatterPlotPlotArea } from './ScatterPlotPlotArea'
import { ScatterPlotTooltip } from './ScatterPlotTooltip'

type ScatterPlotSvgProps = Pick<
  ScatterPlotProps,
  'ariaLabel' | 'formatXValue' | 'formatYValue' | 'height' | 'width'
> & {
  readonly chart: ScatterPlotModel
}

export function ScatterPlotSvg({
  ariaLabel,
  chart,
  formatXValue,
  formatYValue,
  height,
  width,
}: ScatterPlotSvgProps) {
  const [activeDotIndex, setActiveDotIndex] = useState<number | null>(null)
  const activeDots = chart.dots.filter((dot) => dot.index === activeDotIndex)

  return (
    <svg
      className="pristine-scatter-plot__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <ScatterPlotPlotArea chart={chart} width={width} />
      <ScatterPlotGridLines
        chart={chart}
        formatXValue={formatXValue}
        formatYValue={formatYValue}
        height={height}
        width={width}
      />
      <ScatterPlotAxes chart={chart} width={width} />
      <ScatterPlotDots
        activeDotIndex={activeDotIndex}
        chart={chart}
        formatXValue={formatXValue}
        formatYValue={formatYValue}
        onActivate={setActiveDotIndex}
        onDeactivate={() => setActiveDotIndex(null)}
      />
      {activeDots.map((dot) => (
        <ScatterPlotTooltip
          dot={dot}
          formatXValue={formatXValue}
          formatYValue={formatYValue}
          height={height}
          key={dot.index}
          width={width}
        />
      ))}
    </svg>
  )
}
