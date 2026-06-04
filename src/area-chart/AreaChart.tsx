import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeAreaChart } from './AreaChart.domain'
import { buildAreaChartModel } from './AreaChart.model'
import type { AreaChartProps } from './AreaChart.types'
import { AreaChartFigure } from './components/AreaChartFigure'

export function AreaChart({
  ariaLabel,
  baseline,
  caption,
  className,
  data,
  formatXValue,
  formatYValue,
  height,
  showPoints,
  width,
}: AreaChartProps) {
  const result = useMemo(() => computeAreaChart({ data, baseline }), [baseline, data])

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-area-chart__error', className])}
        title="Chart unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (region) => {
      const chart = buildAreaChartModel(region, width, height)

      return (
        <AreaChartFigure
          ariaLabel={ariaLabel}
          caption={caption}
          chart={chart}
          className={className}
          formatXValue={formatXValue}
          formatYValue={formatYValue}
          height={height}
          showPoints={showPoints}
          width={width}
        />
      )
    },
  })
}
