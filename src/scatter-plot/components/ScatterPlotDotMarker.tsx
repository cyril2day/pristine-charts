import type { KeyboardEvent } from 'react'

import { classNames } from '@/shared'
import { always, ifElse } from '@/shared/fp'
import type { RenderedScatterPlotDot } from '../ScatterPlot.model'

type ScatterPlotDotMarkerProps = {
  readonly active: boolean
  readonly dot: RenderedScatterPlotDot
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
  readonly onActivate: () => void
  readonly onDeactivate: () => void
}

export function ScatterPlotDotMarker({
  active,
  dot,
  formatXValue,
  formatYValue,
  onActivate,
  onDeactivate,
}: ScatterPlotDotMarkerProps) {
  const activeClassName = ifElse(
    always(active),
    always('pristine-scatter-plot__dot--active'),
    always(''),
  )(active)
  const accessibleLabel = `${formatXValue(dot.x)}: ${formatYValue(dot.y)}`
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) =>
    ifElse(
      (candidate: KeyboardEvent<SVGGElement>) => candidate.key === 'Escape',
      () => onDeactivate(),
      always(undefined),
    )(event)

  return (
    <g
      className={classNames(['pristine-scatter-plot__dot', activeClassName])}
      role="img"
      aria-label={accessibleLabel}
      tabIndex={0}
      onBlur={onDeactivate}
      onClick={onActivate}
      onFocus={onActivate}
      onKeyDown={handleKeyDown}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
    >
      <circle
        className="pristine-scatter-plot__dot-hit-area"
        cx={dot.cx}
        cy={dot.cy}
        r={10}
      />
      <circle
        className="pristine-scatter-plot__dot-mark"
        cx={dot.cx}
        cy={dot.cy}
        r={4}
      />
    </g>
  )
}
