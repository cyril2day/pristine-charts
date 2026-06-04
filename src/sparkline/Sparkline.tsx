import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeSparkline } from './Sparkline.domain'
import { buildSparklineModel } from './Sparkline.model'
import type { SparklineProps } from './Sparkline.types'
import { SparklineFigure } from './components/SparklineFigure'

export function Sparkline({
  ariaLabel,
  caption,
  className,
  data,
  height,
  width,
}: SparklineProps) {
  const result = useMemo(() => computeSparkline({ data }), [data])

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-sparkline__error', className])}
        title="Sparkline unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (segments) => {
      const sparkline = buildSparklineModel(segments, width, height)

      return (
        <SparklineFigure
          ariaLabel={ariaLabel}
          caption={caption}
          className={className}
          height={height}
          sparkline={sparkline}
          width={width}
        />
      )
    },
  })
}
