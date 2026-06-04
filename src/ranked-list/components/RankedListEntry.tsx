import type { CSSProperties } from 'react'

import { classNames, matchOption } from '@/shared'
import { always, ifElse } from '@/shared/fp'

import type { RankedListModelChange, RankedListModelEntry } from '../RankedList.model'

type RankedListEntryStyle = CSSProperties & {
  readonly '--pristine-ranked-list-value-width': string
}

type RankedListEntryProps = {
  readonly entry: RankedListModelEntry
  readonly showRankChanges: boolean
}

const toEntryStyle = (entry: RankedListModelEntry): RankedListEntryStyle => ({
  '--pristine-ranked-list-value-width': entry.valueBarWidth,
})

const hasChangedRank = (change: RankedListModelChange) => change.amount !== 0

const renderChangeAmount = ifElse(
  hasChangedRank,
  (change: RankedListModelChange) => (
    <span className="pristine-ranked-list__change-amount">{change.amountLabel}</span>
  ),
  always(null),
)

const renderVisibleRankChange = (change: RankedListModelChange) => (
  <span
    className={classNames([
      'pristine-ranked-list__change',
      `pristine-ranked-list__change--${change.directionClassName}`,
    ])}
    aria-label={change.ariaLabel}
  >
    <span className="pristine-ranked-list__change-direction">{change.directionLabel}</span>
    {renderChangeAmount(change)}
  </span>
)

const renderChangeWhenVisible = (showRankChanges: boolean) =>
  ifElse(
    always(showRankChanges),
    renderVisibleRankChange,
    always(null),
  )

const renderRankChange = (
  change: RankedListModelEntry['change'],
  showRankChanges: boolean,
) =>
  matchOption(change, {
    none: always(null),
    some: (value) => renderChangeWhenVisible(showRankChanges)(value),
  })

export function RankedListEntry({ entry, showRankChanges }: RankedListEntryProps) {
  return (
    <li
      className="pristine-ranked-list__entry"
      aria-label={entry.summaryLabel}
      style={toEntryStyle(entry)}
    >
      <span className="pristine-ranked-list__rank">{entry.rankLabel}</span>
      <span className="pristine-ranked-list__item">
        <span className="pristine-ranked-list__label">{entry.label}</span>
        <span className="pristine-ranked-list__meter" aria-hidden="true">
          <span
            className={classNames([
              'pristine-ranked-list__meter-fill',
              `pristine-ranked-list__meter-fill--${entry.valueDirectionClassName}`,
            ])}
          />
        </span>
      </span>
      <span
        className={classNames([
          'pristine-ranked-list__value',
          `pristine-ranked-list__value--${entry.valueDirectionClassName}`,
        ])}
      >
        {entry.valueLabel}
      </span>
      {renderRankChange(entry.change, showRankChanges)}
    </li>
  )
}
