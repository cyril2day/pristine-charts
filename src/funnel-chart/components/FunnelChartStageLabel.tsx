import type { RenderedFunnelStage } from '../FunnelChart.model'

type FunnelChartStageLabelProps = {
  readonly stage: RenderedFunnelStage
}

export function FunnelChartStageLabel({ stage }: FunnelChartStageLabelProps) {
  return (
    <text
      className="pristine-funnel-chart__label"
      x={stage.labelX}
      y={stage.centerY}
      textAnchor="end"
    >
      {stage.stage}
    </text>
  )
}
