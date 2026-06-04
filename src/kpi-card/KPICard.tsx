import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeKPICard } from './KPICard.domain'
import { buildKPICardModel } from './KPICard.model'
import { KPICardFigure } from './components/KPICardFigure'
import type { KPICardProps } from './KPICard.types'

export function KPICard({
  metricName,
  currentValue,
  referenceValue,
  polarity,
  width,
  height,
  ariaLabel,
  className,
  caption,
  comparisonLabel,
  formatValue,
  formatChangeAmount,
  formatChangePercentage,
}: KPICardProps) {
  const result = useMemo(
    () => computeKPICard({ metricName, currentValue, referenceValue, polarity }),
    [currentValue, metricName, polarity, referenceValue],
  )

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-kpi-card__error', className])}
        title="KPI unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (summary) => {
      const kpi = buildKPICardModel(
        summary,
        comparisonLabel,
        formatValue,
        formatChangeAmount,
        formatChangePercentage,
      )

      return (
        <KPICardFigure
          ariaLabel={ariaLabel}
          caption={caption}
          className={className}
          height={height}
          kpi={kpi}
          width={width}
        />
      )
    },
  })
}
