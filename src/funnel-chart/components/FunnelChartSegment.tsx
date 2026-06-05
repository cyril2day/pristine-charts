import type { RenderedFunnelStage } from '../FunnelChart.model'

type FunnelChartSegmentProps = {
  readonly stage: RenderedFunnelStage
}

export function FunnelChartSegment({ stage }: FunnelChartSegmentProps) {
  return (
    <>
      <path className="pristine-funnel-chart__segment" d={stage.path} />
      <rect
        className="pristine-funnel-chart__hit-area"
        x={stage.hitAreaX}
        y={stage.y}
        width={stage.hitAreaWidth}
        height={stage.height}
      />
    </>
  )
}
