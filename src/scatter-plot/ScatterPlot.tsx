import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeScatterPlot } from './ScatterPlot.domain'
import { buildScatterPlotModel } from './ScatterPlot.model'
import type { ScatterPlotProps } from './ScatterPlot.types'
import { ScatterPlotFigure } from './components/ScatterPlotFigure'

export function ScatterPlot({
  ariaLabel,
  caption,
  className,
  data,
  formatXValue,
  formatYValue,
  height,
  width,
}: ScatterPlotProps) {
  const result = useMemo(() => computeScatterPlot({ data }), [data])

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-scatter-plot__error', className])}
        title="Chart unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (dots) => {
      const chart = buildScatterPlotModel(dots, width, height)

      return (
        <ScatterPlotFigure
          ariaLabel={ariaLabel}
          caption={caption}
          chart={chart}
          className={className}
          formatXValue={formatXValue}
          formatYValue={formatYValue}
          height={height}
          width={width}
        />
      )
    },
  })
}
