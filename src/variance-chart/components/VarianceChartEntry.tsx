import type { KeyboardEvent } from 'react'

import { classNames } from '@/shared'
import { always, ifElse } from '@/shared/fp'

import type { RenderedVarianceEntry } from '../VarianceChart.model'
import type { VarianceChartProps } from '../VarianceChart.types'

import { VarianceChartBar } from './VarianceChartBar'
import { VarianceChartCategoryLabel } from './VarianceChartCategoryLabel'
import { VarianceChartValueLabel } from './VarianceChartValueLabel'

type VarianceChartEntryProps = Pick<
  VarianceChartProps,
  'displayMode' | 'formatPercentage' | 'formatValue' | 'formatVariance' | 'showValues'
> & {
  readonly active: boolean
  readonly entry: RenderedVarianceEntry
  readonly height: number
  readonly onActivate: () => void
  readonly onDeactivate: () => void
}

const getDisplayedVariance = (
  entry: RenderedVarianceEntry,
  displayMode: VarianceChartProps['displayMode'],
  formatVariance: VarianceChartProps['formatVariance'],
  formatPercentage: VarianceChartProps['formatPercentage'],
) =>
  ifElse(
    (candidate: VarianceChartProps['displayMode']) => candidate === 'percentage',
    always(formatPercentage(entry.variancePercentage)),
    always(formatVariance(entry.variance)),
  )(displayMode)

export function VarianceChartEntry({
  active,
  displayMode,
  entry,
  formatPercentage,
  formatValue,
  formatVariance,
  height,
  onActivate,
  onDeactivate,
  showValues,
}: VarianceChartEntryProps) {
  const renderValueLabel = ifElse(
    always(showValues),
    () => (
      <VarianceChartValueLabel
        displayMode={displayMode}
        entry={entry}
        formatPercentage={formatPercentage}
        formatVariance={formatVariance}
      />
    ),
    always(null),
  )
  const activeClassName = ifElse(
    always(active),
    always('pristine-variance-chart__entry--active'),
    always(''),
  )(active)
  const accessibleLabel = [
    `${entry.category}: ${getDisplayedVariance(entry, displayMode, formatVariance, formatPercentage)}`,
    `actual ${formatValue(entry.actualValue)}`,
    `budget ${formatValue(entry.budgetValue)}`,
    entry.favourability,
  ].join(', ')
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) =>
    ifElse(
      (candidate: KeyboardEvent<SVGGElement>) => candidate.key === 'Escape',
      () => onDeactivate(),
      always(undefined),
    )(event)

  return (
    <g
      className={classNames([
        'pristine-variance-chart__entry',
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
      <VarianceChartBar entry={entry} />
      {renderValueLabel()}
      <VarianceChartCategoryLabel entry={entry} height={height} />
    </g>
  )
}
