import type { KeyboardEvent } from 'react'

import { classNames } from '../../shared'
import { always, ifElse } from '../../shared/fp'
import type { RenderedLinePoint } from '../LineChart.model'

type LineChartPointMarkerProps = {
  readonly active: boolean
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
  readonly onActivate: () => void
  readonly onDeactivate: () => void
  readonly point: RenderedLinePoint
  readonly showPoints: boolean
}

export function LineChartPointMarker({
  active,
  formatXValue,
  formatYValue,
  onActivate,
  onDeactivate,
  point,
  showPoints,
}: LineChartPointMarkerProps) {
  const activeClassName = ifElse(
    always(active),
    always('pristine-line-chart__point--active'),
    always(''),
  )(active)
  const visibleClassName = ifElse(
    always(showPoints),
    always('pristine-line-chart__point--visible'),
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
        'pristine-line-chart__point',
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
        className="pristine-line-chart__point-hit-area"
        cx={point.cx}
        cy={point.cy}
        r={10}
      />
      <circle
        className="pristine-line-chart__point-dot"
        cx={point.cx}
        cy={point.cy}
        r={3.6}
      />
    </g>
  )
}
