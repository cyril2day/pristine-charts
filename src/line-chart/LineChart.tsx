import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeLineChart } from './LineChart.domain'
import { buildLineChartModel } from './LineChart.model'
import type { LineChartProps } from './LineChart.types'
import { LineChartFigure } from './components/LineChartFigure'

export function LineChart({
  ariaLabel,
  caption,
  className,
  data,
  formatXValue,
  formatYValue,
  height,
  showPoints,
  width,
}: LineChartProps) {
  const result = useMemo(() => computeLineChart({ data }), [data])

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-line-chart__error', className])}
        title="Chart unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (segments) => {
      const chart = buildLineChartModel(segments, width, height)

      return (
        <LineChartFigure
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
