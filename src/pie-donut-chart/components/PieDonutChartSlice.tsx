import type { KeyboardEvent } from 'react'

import { classNames } from '../../shared'
import { always, ifElse } from '../../shared/fp'
import type { RenderedArc } from '../PieDonutChart.model'

type PieDonutChartSliceProps = {
  readonly active: boolean
  readonly arc: RenderedArc
  readonly formatPercentage: (proportion: number) => string
  readonly formatValue: (value: number) => string
  readonly onActivate: () => void
  readonly onDeactivate: () => void
}

export function PieDonutChartSlice({
  active,
  arc,
  formatPercentage,
  formatValue,
  onActivate,
  onDeactivate,
}: PieDonutChartSliceProps) {
  const activeClassName = ifElse(
    always(active),
    always('pristine-pie-donut-chart__slice--active'),
    always(''),
  )(active)
  const accessibleLabel = `${arc.category}: ${formatValue(arc.value)} (${formatPercentage(
    arc.proportion,
  )})`
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) =>
    ifElse(
      (candidate: KeyboardEvent<SVGGElement>) => candidate.key === 'Escape',
      () => onDeactivate(),
      always(undefined),
    )(event)

  return (
    <g
      className={classNames([
        'pristine-pie-donut-chart__slice',
        `pristine-pie-donut-chart__slice--tone-${String(arc.colorIndex)}`,
        activeClassName,
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
      <path className="pristine-pie-donut-chart__slice-path" d={arc.path} />
    </g>
  )
}
