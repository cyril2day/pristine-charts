import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computePieDonutChart } from './PieDonutChart.domain'
import { buildPieDonutChartModel } from './PieDonutChart.model'
import type { PieDonutChartProps } from './PieDonutChart.types'
import { PieDonutChartFigure } from './components/PieDonutChartFigure'

export function PieDonutChart({
  ariaLabel,
  caption,
  className,
  data,
  formatPercentage,
  formatValue,
  height,
  showLabels,
  variant,
  width,
}: PieDonutChartProps) {
  const result = useMemo(() => computePieDonutChart({ data, variant }), [data, variant])

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-pie-donut-chart__error', className])}
        title="Chart unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (whole) => {
      const chart = buildPieDonutChartModel(whole, width, height)

      return (
        <PieDonutChartFigure
          ariaLabel={ariaLabel}
          caption={caption}
          chart={chart}
          className={className}
          formatPercentage={formatPercentage}
          formatValue={formatValue}
          height={height}
          showLabels={showLabels}
          width={width}
        />
      )
    },
  })
}
