import { classNames } from '../../shared'

import type { BoxPlotModel } from '../BoxPlot.model'
import type { BoxPlotProps } from '../BoxPlot.types'

import { BoxPlotCaption } from './BoxPlotCaption'
import { BoxPlotSvg } from './BoxPlotSvg'

type BoxPlotFigureProps = Pick<
  BoxPlotProps,
  'ariaLabel' | 'caption' | 'className' | 'height' | 'width'
> & {
  readonly chart: BoxPlotModel
}

export function BoxPlotFigure({
  ariaLabel,
  caption,
  chart,
  className,
  height,
  width,
}: BoxPlotFigureProps) {
  return (
    <figure className={classNames(['pristine-box-plot', className])} aria-label={ariaLabel}>
      <BoxPlotSvg
        ariaLabel={ariaLabel}
        chart={chart}
        height={height}
        width={width}
      />
      <BoxPlotCaption caption={caption} />
    </figure>
  )
}
