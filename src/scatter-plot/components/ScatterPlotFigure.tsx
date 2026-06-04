import { classNames } from '@/shared'

import type { ScatterPlotModel } from '../ScatterPlot.model'
import type { ScatterPlotProps } from '../ScatterPlot.types'

import { ScatterPlotCaption } from './ScatterPlotCaption'
import { ScatterPlotSvg } from './ScatterPlotSvg'

type ScatterPlotFigureProps = Pick<
  ScatterPlotProps,
  | 'ariaLabel'
  | 'caption'
  | 'className'
  | 'formatXValue'
  | 'formatYValue'
  | 'height'
  | 'width'
> & {
  readonly chart: ScatterPlotModel
}

export function ScatterPlotFigure({
  ariaLabel,
  caption,
  chart,
  className,
  formatXValue,
  formatYValue,
  height,
  width,
}: ScatterPlotFigureProps) {
  return (
    <figure className={classNames(['pristine-scatter-plot', className])} aria-label={ariaLabel}>
      <ScatterPlotSvg
        ariaLabel={ariaLabel}
        chart={chart}
        formatXValue={formatXValue}
        formatYValue={formatYValue}
        height={height}
        width={width}
      />
      <ScatterPlotCaption caption={caption} />
    </figure>
  )
}
