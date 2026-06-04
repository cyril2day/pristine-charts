import { useId } from 'react'

import { ifElse } from '@/shared/fp'

import type { ProgressBarModel } from '../ProgressBar.model'
import type { ProgressBarProps } from '../ProgressBar.types'

type ProgressBarSvgProps = Pick<
  ProgressBarProps,
  'ariaLabel' | 'height' | 'showLabel' | 'width'
> & {
  readonly progress: ProgressBarModel
}

const hasFill = (progress: ProgressBarModel) => progress.fillWidth > 0

export function ProgressBarSvg({
  ariaLabel,
  height,
  progress,
  showLabel,
  width,
}: ProgressBarSvgProps) {
  const clipPathId = `pristine-progress-bar-${useId().replaceAll(':', '')}`
  const valueText = `${progress.valueLabel} (${progress.percentageLabel})`
  const renderFill = ifElse(
    hasFill,
    () => (
      <rect
        className="pristine-progress-bar__fill"
        x={progress.trackX}
        y={progress.trackY}
        width={progress.fillWidth}
        height={progress.trackHeight}
        clipPath={`url(#${clipPathId})`}
      />
    ),
    () => null,
  )
  const renderLabels = ifElse(
    (candidate: boolean) => candidate,
    () => (
      <g className="pristine-progress-bar__labels" aria-hidden="true">
        <text
          className="pristine-progress-bar__value"
          x={progress.trackX}
          y={progress.labelY}
        >
          {progress.valueLabel}
        </text>
        <text
          className="pristine-progress-bar__percentage"
          x={progress.trackX + progress.trackWidth}
          y={progress.labelY}
          textAnchor="end"
        >
          {progress.percentageLabel}
        </text>
      </g>
    ),
    () => null,
  )

  return (
    <svg
      className="pristine-progress-bar__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <clipPath id={clipPathId}>
          <rect
            x={progress.trackX}
            y={progress.trackY}
            width={progress.trackWidth}
            height={progress.trackHeight}
            rx={progress.trackRadius}
          />
        </clipPath>
      </defs>
      {renderLabels(showLabel)}
      <g
        className="pristine-progress-bar__meter"
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={progress.total}
        aria-valuenow={progress.currentValue}
        aria-valuetext={valueText}
      >
        <rect
          className="pristine-progress-bar__track"
          x={progress.trackX}
          y={progress.trackY}
          width={progress.trackWidth}
          height={progress.trackHeight}
          rx={progress.trackRadius}
        />
        {renderFill(progress)}
      </g>
    </svg>
  )
}
