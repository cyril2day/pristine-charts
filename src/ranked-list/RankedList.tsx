import { useMemo } from 'react'

import { ChartError } from '../chart-error'
import { classNames, matchResult } from '../shared'

import { computeRankedList } from './RankedList.domain'
import { buildRankedListModel } from './RankedList.model'
import { RankedListFigure } from './components/RankedListFigure'
import type { RankedListProps } from './RankedList.types'

export function RankedList({
  data,
  width,
  height,
  ariaLabel,
  className,
  caption,
  showRankChanges,
  formatValue,
  formatRank,
  formatRankChange,
}: RankedListProps) {
  const result = useMemo(() => computeRankedList({ data }), [data])

  return matchResult(result, {
    error: (error) => (
      <ChartError
        className={classNames(['pristine-ranked-list__error', className])}
        title="Ranked list unavailable"
        message={error.message}
        details={error.details}
        role="alert"
      />
    ),
    ok: (entries) => {
      const rankedList = buildRankedListModel(
        entries,
        formatValue,
        formatRank,
        formatRankChange,
      )

      return (
        <RankedListFigure
          ariaLabel={ariaLabel}
          caption={caption}
          className={className}
          height={height}
          rankedList={rankedList}
          showRankChanges={showRankChanges}
          width={width}
        />
      )
    },
  })
}
