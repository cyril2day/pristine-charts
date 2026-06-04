import { classNames } from '@/shared'

import type { ProgressBarModel } from '../ProgressBar.model'
import type { ProgressBarProps } from '../ProgressBar.types'

import { ProgressBarCaption } from './ProgressBarCaption'
import { ProgressBarSvg } from './ProgressBarSvg'

type ProgressBarFigureProps = Pick<
  ProgressBarProps,
  'ariaLabel' | 'caption' | 'className' | 'height' | 'showLabel' | 'width'
> & {
  readonly progress: ProgressBarModel
}

export function ProgressBarFigure({
  ariaLabel,
  caption,
  className,
  height,
  progress,
  showLabel,
  width,
}: ProgressBarFigureProps) {
  return (
    <figure className={classNames(['pristine-progress-bar', className])} aria-label={ariaLabel}>
      <ProgressBarSvg
        ariaLabel={ariaLabel}
        height={height}
        progress={progress}
        showLabel={showLabel}
        width={width}
      />
      <ProgressBarCaption caption={caption} />
    </figure>
  )
}
