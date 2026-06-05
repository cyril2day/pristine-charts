import type { FunnelChartModel } from '../FunnelChart.model'
import type { FunnelChartProps } from '../FunnelChart.types'

import { FunnelChartStage } from './FunnelChartStage'

type FunnelChartStagesProps = Pick<
  FunnelChartProps,
  'formatPercentage' | 'formatValue' | 'showValues'
> & {
  readonly activeStage: string | null
  readonly chart: FunnelChartModel
  readonly onActivate: (stage: string) => void
  readonly onDeactivate: () => void
}

export function FunnelChartStages({
  activeStage,
  chart,
  formatPercentage,
  formatValue,
  onActivate,
  onDeactivate,
  showValues,
}: FunnelChartStagesProps) {
  return (
    <g className="pristine-funnel-chart__stages">
      {chart.stages.map((stage) => (
        <FunnelChartStage
          active={stage.stage === activeStage}
          formatPercentage={formatPercentage}
          formatValue={formatValue}
          key={stage.stage}
          onActivate={() => onActivate(stage.stage)}
          onDeactivate={onDeactivate}
          showValues={showValues}
          stage={stage}
        />
      ))}
    </g>
  )
}
