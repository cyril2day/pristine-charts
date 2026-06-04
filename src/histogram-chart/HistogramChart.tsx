import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeHistogram } from './HistogramChart.domain'
import { buildHistogramChartModel } from './HistogramChart.model'
import { HistogramChartFigure } from './components/HistogramChartFigure'
import type { HistogramChartProps } from './HistogramChart.types'

export function HistogramChart({
  data,
  binStrategy,
  width,
  height,
  ariaLabel,
  className,
  caption,
  showCounts,
  formatBinLabel,
}: HistogramChartProps) {
  const result = useMemo(
    () => computeHistogram({ data, binStrategy }),
    [binStrategy, data],
  )

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-histogram-chart__error', className])}
        title="Chart unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (bins) => {
      const chart = buildHistogramChartModel(bins, width, height, formatBinLabel)

      return (
        <HistogramChartFigure
          ariaLabel={ariaLabel}
          caption={caption}
          chart={chart}
          className={className}
          height={height}
          showCounts={showCounts}
          width={width}
        />
      )
    },
  })
}
