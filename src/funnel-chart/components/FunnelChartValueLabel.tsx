import { matchOption } from '@/shared'

import type { RenderedFunnelStage } from '../FunnelChart.model'

type FunnelChartValueLabelProps = {
  readonly stage: RenderedFunnelStage
  readonly formatValue: (value: number) => string
  readonly formatPercentage: (rate: number) => string
}

export function FunnelChartValueLabel({
  stage,
  formatValue,
  formatPercentage,
}: FunnelChartValueLabelProps) {
  return (
    <text
      className="pristine-funnel-chart__value"
      x={stage.valueX}
      y={stage.centerY - 5}
      textAnchor="start"
    >
      <tspan x={stage.valueX}>{formatValue(stage.value)}</tspan>
      {matchOption(stage.conversionRate, {
        none: () => null,
        some: (conversionRate) => (
          <tspan
            className="pristine-funnel-chart__conversion"
            x={stage.valueX}
            dy={14}
          >
            {formatPercentage(conversionRate)}
          </tspan>
        ),
      })}
    </text>
  )
}
