import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeGaugeChart } from './GaugeChart.domain'
import { buildGaugeChartModel } from './GaugeChart.model'
import type { GaugeChartProps } from './GaugeChart.types'
import { GaugeChartFigure } from './components/GaugeChartFigure'

export function GaugeChart({
  currentValue,
  minimum,
  maximum,
  zones,
  width,
  height,
  ariaLabel,
  className,
  caption,
  showLabels,
  formatValue,
}: GaugeChartProps) {
  const result = useMemo(
    () => computeGaugeChart({ currentValue, minimum, maximum, zones }),
    [currentValue, minimum, maximum, zones],
  )

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-gauge-chart__error', className])}
        title="Gauge chart unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (summary) => {
      const chart = buildGaugeChartModel(summary, width, height, formatValue)

      return (
        <GaugeChartFigure
          ariaLabel={ariaLabel}
          caption={caption}
          chart={chart}
          className={className}
          formatValue={formatValue}
          height={height}
          showLabels={showLabels}
          width={width}
        />
      )
    },
  })
}
