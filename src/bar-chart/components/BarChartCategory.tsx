import type { KeyboardEvent } from 'react'

import { classNames } from '../../shared'
import type { RenderedBar } from '../BarChart.model'
import { always, ifElse } from '../../shared/fp'

import { BarChartBar } from './BarChartBar'
import { BarChartCategoryLabel } from './BarChartCategoryLabel'
import { BarChartValueLabel } from './BarChartValueLabel'

type BarChartCategoryProps = {
  readonly active: boolean
  readonly bar: RenderedBar
  readonly formatValue: (value: number) => string
  readonly height: number
  readonly onActivate: () => void
  readonly onDeactivate: () => void
  readonly showValues: boolean
}

export function BarChartCategory({
  active,
  bar,
  formatValue,
  height,
  onActivate,
  onDeactivate,
  showValues,
}: BarChartCategoryProps) {
  const renderValueLabel = ifElse(
    always(showValues),
    () => <BarChartValueLabel bar={bar} formatValue={formatValue} />,
    always(null),
  )
  const activeClassName = ifElse(
    always(active),
    always('pristine-bar-chart__category--active'),
    always(''),
  )(active)
  const accessibleLabel = `${bar.category}: ${formatValue(bar.value)}`
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) =>
    ifElse(
      (candidate: KeyboardEvent<SVGGElement>) => candidate.key === 'Escape',
      () => onDeactivate(),
      always(undefined),
    )(event)

  return (
    <g
      className={classNames([
        'pristine-bar-chart__category',
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
      <BarChartBar bar={bar} />
      {renderValueLabel()}
      <BarChartCategoryLabel bar={bar} height={height} />
    </g>
  )
}
