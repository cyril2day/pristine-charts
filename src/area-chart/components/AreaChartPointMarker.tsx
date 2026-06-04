import type { KeyboardEvent } from 'react'

import { classNames } from '@/shared'
import { always, ifElse } from '@/shared/fp'
import type { RenderedAreaPoint } from '../AreaChart.model'

type AreaChartPointMarkerProps = {
  readonly active: boolean
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
  readonly onActivate: () => void
  readonly onDeactivate: () => void
  readonly point: RenderedAreaPoint
  readonly showPoints: boolean
}

export function AreaChartPointMarker({
  active,
  formatXValue,
  formatYValue,
  onActivate,
  onDeactivate,
  point,
  showPoints,
}: AreaChartPointMarkerProps) {
  const activeClassName = ifElse(
    always(active),
    always('pristine-area-chart__point--active'),
    always(''),
  )(active)
  const visibleClassName = ifElse(
    always(showPoints),
    always('pristine-area-chart__point--visible'),
    always(''),
  )(showPoints)
  const accessibleLabel = `${formatXValue(point.x)}: ${formatYValue(point.y)}`
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) =>
    ifElse(
      (candidate: KeyboardEvent<SVGGElement>) => candidate.key === 'Escape',
      () => onDeactivate(),
      always(undefined),
    )(event)

  return (
    <g
      className={classNames([
        'pristine-area-chart__point',
        activeClassName,
        visibleClassName,
      ])}
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
        className="pristine-area-chart__point-hit-area"
        cx={point.cx}
        cy={point.cy}
        r={10}
      />
      <circle
        className="pristine-area-chart__point-dot"
        cx={point.cx}
        cy={point.cy}
        r={3.6}
      />
    </g>
  )
}
