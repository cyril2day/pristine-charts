import type { KeyboardEvent } from 'react'

import { classNames } from '@/shared'
import type { RenderedHistogramBin } from '../HistogramChart.model'
import { always, ifElse } from '@/shared/fp'

import { HistogramChartBar } from './HistogramChartBar'
import { HistogramChartCountLabel } from './HistogramChartCountLabel'

type HistogramChartBinProps = {
  readonly active: boolean
  readonly bar: RenderedHistogramBin
  readonly onActivate: () => void
  readonly onDeactivate: () => void
  readonly showCounts: boolean
}

export function HistogramChartBin({
  active,
  bar,
  onActivate,
  onDeactivate,
  showCounts,
}: HistogramChartBinProps) {
  const renderCountLabel = ifElse(
    always(showCounts),
    () => <HistogramChartCountLabel bar={bar} />,
    always(null),
  )
  const activeClassName = ifElse(
    always(active),
    always('pristine-histogram-chart__bin--active'),
    always(''),
  )(active)
  const accessibleLabel = `${bar.label}: ${bar.count}`
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) =>
    ifElse(
      (candidate: KeyboardEvent<SVGGElement>) => candidate.key === 'Escape',
      () => onDeactivate(),
      always(undefined),
    )(event)

  return (
    <g
      className={classNames([
        'pristine-histogram-chart__bin',
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
      <HistogramChartBar bar={bar} />
      {renderCountLabel()}
    </g>
  )
}
