import { ifElse } from '../../shared/fp'

import type { RenderedBar } from '../BarChart.model'

type BarChartBarProps = {
  readonly bar: RenderedBar
}

const getHitAreaY = ifElse(
  (bar: RenderedBar) => bar.height > 0,
  (bar: RenderedBar) => bar.y,
  (bar: RenderedBar) => bar.y - 4,
)

export function BarChartBar({ bar }: BarChartBarProps) {
  return (
    <>
      <rect
        className={`pristine-bar-chart__bar pristine-bar-chart__bar--${bar.direction}`}
        x={bar.x}
        y={bar.y}
        width={bar.width}
        height={bar.height}
        aria-hidden="true"
      />
      <rect
        className="pristine-bar-chart__bar-hit-area"
        x={bar.x}
        y={getHitAreaY(bar)}
        width={bar.width}
        height={Math.max(bar.height, 8)}
        aria-hidden="true"
      />
    </>
  )
}
