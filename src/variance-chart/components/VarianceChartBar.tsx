import { ifElse } from '@/shared/fp'

import type { RenderedVarianceEntry } from '../VarianceChart.model'

type VarianceChartBarProps = {
  readonly entry: RenderedVarianceEntry
}

const getHitAreaY = ifElse(
  (entry: RenderedVarianceEntry) => entry.height > 0,
  (entry: RenderedVarianceEntry) => entry.y,
  (entry: RenderedVarianceEntry) => entry.y - 4,
)

export function VarianceChartBar({ entry }: VarianceChartBarProps) {
  return (
    <>
      <rect
        className={`pristine-variance-chart__bar pristine-variance-chart__bar--${entry.favourabilityClassName}`}
        x={entry.x}
        y={entry.y}
        width={entry.width}
        height={entry.height}
        aria-hidden="true"
      />
      <rect
        className="pristine-variance-chart__bar-hit-area"
        x={entry.x}
        y={getHitAreaY(entry)}
        width={entry.width}
        height={Math.max(entry.height, 8)}
        aria-hidden="true"
      />
    </>
  )
}
