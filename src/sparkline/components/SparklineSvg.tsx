import type { SparklineModel } from '../Sparkline.model'
import type { SparklineProps } from '../Sparkline.types'

import { SparklinePath } from './SparklinePath'

type SparklineSvgProps = Pick<SparklineProps, 'ariaLabel' | 'height' | 'width'> & {
  readonly sparkline: SparklineModel
}

export function SparklineSvg({
  ariaLabel,
  height,
  sparkline,
  width,
}: SparklineSvgProps) {
  return (
    <svg
      className="pristine-sparkline__svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <SparklinePath sparkline={sparkline} />
    </svg>
  )
}
