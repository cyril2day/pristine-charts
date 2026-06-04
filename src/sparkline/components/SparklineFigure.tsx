import { classNames } from '@/shared'

import type { SparklineModel } from '../Sparkline.model'
import type { SparklineProps } from '../Sparkline.types'

import { SparklineCaption } from './SparklineCaption'
import { SparklineSvg } from './SparklineSvg'

type SparklineFigureProps = Pick<
  SparklineProps,
  'ariaLabel' | 'caption' | 'className' | 'height' | 'width'
> & {
  readonly sparkline: SparklineModel
}

export function SparklineFigure({
  ariaLabel,
  caption,
  className,
  height,
  sparkline,
  width,
}: SparklineFigureProps) {
  return (
    <figure className={classNames(['pristine-sparkline', className])} aria-label={ariaLabel}>
      <SparklineSvg
        ariaLabel={ariaLabel}
        height={height}
        sparkline={sparkline}
        width={width}
      />
      <SparklineCaption caption={caption} />
    </figure>
  )
}
