import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeVarianceChart } from './VarianceChart.domain'
import { buildVarianceChartModel } from './VarianceChart.model'
import { VarianceChartFigure } from './components/VarianceChartFigure'
import type { VarianceChartProps } from './VarianceChart.types'

export function VarianceChart({
  data,
  polarity,
  width,
  height,
  ariaLabel,
  className,
  caption,
  displayMode,
  showValues,
  formatValue,
  formatVariance,
  formatPercentage,
}: VarianceChartProps) {
  const result = useMemo(
    () => computeVarianceChart({ data, polarity }),
    [data, polarity],
  )

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-variance-chart__error', className])}
        title="Chart unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (entries) => {
      const chart = buildVarianceChartModel(entries, width, height, displayMode)

      return (
        <VarianceChartFigure
          ariaLabel={ariaLabel}
          caption={caption}
          chart={chart}
          className={className}
          displayMode={displayMode}
          formatPercentage={formatPercentage}
          formatValue={formatValue}
          formatVariance={formatVariance}
          height={height}
          showValues={showValues}
          width={width}
        />
      )
    },
  })
}
