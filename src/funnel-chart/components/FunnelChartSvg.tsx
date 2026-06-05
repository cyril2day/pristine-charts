import { useState } from 'react'

import type { FunnelChartModel } from '../FunnelChart.model'
import type { FunnelChartProps } from '../FunnelChart.types'

import { FunnelChartStages } from './FunnelChartStages'
import { FunnelChartTooltip } from './FunnelChartTooltip'

type FunnelChartSvgProps = Pick<
  FunnelChartProps,
  'ariaLabel' | 'formatPercentage' | 'formatValue' | 'height' | 'showValues' | 'width'
> & {
  readonly chart: FunnelChartModel
}

export function FunnelChartSvg({
  ariaLabel,
  chart,
  formatPercentage,
  formatValue,
  height,
  showValues,
  width,
}: FunnelChartSvgProps) {
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const activeStages = chart.stages.filter((stage) => stage.stage === activeStage)

  return (
    <svg
      className="pristine-funnel-chart__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <rect
        className="pristine-funnel-chart__plot"
        x={chart.plotLeft}
        y={chart.plotTop}
        width={chart.plotRight - chart.plotLeft}
        height={chart.plotBottom - chart.plotTop}
      />
      <FunnelChartStages
        activeStage={activeStage}
        chart={chart}
        formatPercentage={formatPercentage}
        formatValue={formatValue}
        onActivate={setActiveStage}
        onDeactivate={() => setActiveStage(null)}
        showValues={showValues}
      />
      {activeStages.map((stage) => (
        <FunnelChartTooltip
          formatPercentage={formatPercentage}
          formatValue={formatValue}
          height={height}
          key={stage.stage}
          stage={stage}
          width={width}
        />
      ))}
    </svg>
  )
}
