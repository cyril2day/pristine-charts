import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeFunnelChart } from './FunnelChart.domain'
import { buildFunnelChartModel } from './FunnelChart.model'
import { FunnelChartFigure } from './components/FunnelChartFigure'
import type { FunnelChartProps } from './FunnelChart.types'

export function FunnelChart({
  data,
  width,
  height,
  ariaLabel,
  className,
  caption,
  showValues,
  formatValue,
  formatPercentage,
}: FunnelChartProps) {
  const result = useMemo(() => computeFunnelChart({ data }), [data])

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-funnel-chart__error', className])}
        title="Chart unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (stages) => {
      const chart = buildFunnelChartModel(stages, width, height)

      return (
        <FunnelChartFigure
          ariaLabel={ariaLabel}
          caption={caption}
          chart={chart}
          className={className}
          formatPercentage={formatPercentage}
          formatValue={formatValue}
          height={height}
          showValues={showValues}
          width={width}
        />
      )
    },
  })
}
