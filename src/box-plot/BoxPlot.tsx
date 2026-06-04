import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeBoxPlot } from './BoxPlot.domain'
import { buildBoxPlotModel } from './BoxPlot.model'
import { BoxPlotFigure } from './components/BoxPlotFigure'
import type { BoxPlotProps } from './BoxPlot.types'

export function BoxPlot({
  data,
  width,
  height,
  ariaLabel,
  className,
  caption,
  formatValue,
}: BoxPlotProps) {
  const result = useMemo(
    () => computeBoxPlot({ data }),
    [data],
  )

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-box-plot__error', className])}
        title="Chart unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (summary) => {
      const chart = buildBoxPlotModel(summary, width, height, formatValue)

      return (
        <BoxPlotFigure
          ariaLabel={ariaLabel}
          caption={caption}
          chart={chart}
          className={className}
          height={height}
          width={width}
        />
      )
    },
  })
}
