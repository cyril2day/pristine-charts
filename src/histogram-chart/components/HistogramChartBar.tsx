import { ifElse } from '@/shared/fp'

import type { RenderedHistogramBin } from '../HistogramChart.model'

type HistogramChartBarProps = {
  readonly bar: RenderedHistogramBin
}

const getHitAreaY = ifElse(
  (bar: RenderedHistogramBin) => bar.height > 0,
  (bar: RenderedHistogramBin) => bar.y,
  (bar: RenderedHistogramBin) => bar.y - 8,
)

export function HistogramChartBar({ bar }: HistogramChartBarProps) {
  return (
    <>
      <rect
        className="pristine-histogram-chart__bar"
        x={bar.x}
        y={bar.y}
        width={bar.width}
        height={bar.height}
        aria-hidden="true"
      />
      <rect
        className="pristine-histogram-chart__bar-hit-area"
        x={bar.x}
        y={getHitAreaY(bar)}
        width={bar.width}
        height={Math.max(bar.height, 8)}
        aria-hidden="true"
      />
    </>
  )
}
