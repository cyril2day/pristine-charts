import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeProgressBar } from './ProgressBar.domain'
import { buildProgressBarModel } from './ProgressBar.model'
import { ProgressBarFigure } from './components/ProgressBarFigure'
import type { ProgressBarProps } from './ProgressBar.types'

export function ProgressBar({
  currentValue,
  total,
  width,
  height,
  ariaLabel,
  className,
  caption,
  showLabel,
  formatValue,
  formatPercentage,
}: ProgressBarProps) {
  const result = useMemo(
    () => computeProgressBar({ currentValue, total }),
    [currentValue, total],
  )

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-progress-bar__error', className])}
        title="Progress unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (ratio) => {
      const progress = buildProgressBarModel(
        currentValue,
        total,
        ratio,
        width,
        height,
        formatValue,
        formatPercentage,
      )

      return (
        <ProgressBarFigure
          ariaLabel={ariaLabel}
          caption={caption}
          className={className}
          height={height}
          progress={progress}
          showLabel={showLabel}
          width={width}
        />
      )
    },
  })
}
