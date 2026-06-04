import { useState } from 'react'

import type { BoxPlotModel } from '../BoxPlot.model'
import type { BoxPlotProps } from '../BoxPlot.types'

import { BoxPlotAxes } from './BoxPlotAxes'
import { BoxPlotDistribution } from './BoxPlotDistribution'
import { BoxPlotGridLines } from './BoxPlotGridLines'
import { BoxPlotPlotArea } from './BoxPlotPlotArea'
import { BoxPlotTooltip } from './BoxPlotTooltip'
import { BoxPlotXTicks } from './BoxPlotXTicks'

type BoxPlotSvgProps = Pick<BoxPlotProps, 'ariaLabel' | 'height' | 'width'> & {
  readonly chart: BoxPlotModel
}

export function BoxPlotSvg({
  ariaLabel,
  chart,
  height,
  width,
}: BoxPlotSvgProps) {
  const [activePartKey, setActivePartKey] = useState<string | null>(null)
  const activeParts = chart.parts.filter((part) => part.key === activePartKey)

  return (
    <svg
      className="pristine-box-plot__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <BoxPlotPlotArea chart={chart} width={width} />
      <BoxPlotGridLines chart={chart} />
      <BoxPlotAxes chart={chart} width={width} />
      <BoxPlotDistribution
        activePartKey={activePartKey}
        chart={chart}
        onActivate={setActivePartKey}
        onDeactivate={() => setActivePartKey(null)}
      />
      <BoxPlotXTicks chart={chart} height={height} />
      {activeParts.map((part) => (
        <BoxPlotTooltip
          key={part.key}
          height={height}
          part={part}
          width={width}
        />
      ))}
    </svg>
  )
}
