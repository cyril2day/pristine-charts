import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeBarChart } from './BarChart.domain'
import { buildBarChartModel } from './BarChart.model'
import { BarChartFigure } from './components/BarChartFigure'
import type { BarChartProps } from './BarChart.types'

export function BarChart({
  data,
  width,
  height,
  ariaLabel,
  className,
  caption,
  orderStrategy,
  showValues,
  formatValue,
}: BarChartProps) {
  const result = useMemo(
    () => computeBarChart({ data, orderStrategy }),
    [data, orderStrategy],
  )

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-bar-chart__error', className])}
        title="Chart unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (bars) => {
      const chart = buildBarChartModel(bars, width, height)

      return (
        <BarChartFigure
          ariaLabel={ariaLabel}
          caption={caption}
          chart={chart}
          className={className}
          formatValue={formatValue}
          height={height}
          showValues={showValues}
          width={width}
        />
      )
    },
  })
}
