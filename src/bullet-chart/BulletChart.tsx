import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeBulletChart } from './BulletChart.domain'
import { buildBulletChartModel } from './BulletChart.model'
import { BulletChartFigure } from './components/BulletChartFigure'
import type { BulletChartProps } from './BulletChart.types'

export function BulletChart({
  currentValue,
  targetValue,
  bands,
  width,
  height,
  ariaLabel,
  className,
  caption,
  showLabels,
  formatValue,
}: BulletChartProps) {
  const result = useMemo(
    () => computeBulletChart({ currentValue, targetValue, bands }),
    [currentValue, targetValue, bands],
  )

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-bullet-chart__error', className])}
        title="Bullet chart unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (summary) => {
      const chart = buildBulletChartModel(summary, width, height, formatValue)

      return (
        <BulletChartFigure
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
