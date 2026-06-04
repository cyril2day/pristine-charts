import { none } from '../shared'
import { ifElse } from '../shared/fp'

import type { RankedListProps } from './RankedList.types'

export const formatRankedListNumber = ifElse(
  Number.isInteger,
  String,
  (value: number) => value.toFixed(2).replace(/\.?0+$/, ''),
)

export const formatRankedListRank = (rank: number) => `#${String(rank)}`

export const formatRankedListRankChange = (rankChange: number) =>
  ifElse(
    (candidate: number) => candidate > 0,
    (candidate: number) => `+${String(candidate)}`,
    String,
  )(rankChange)

export const DEFAULT_RANKED_LIST_VIEW_PROPS = {
  width: 420,
  height: 260,
  ariaLabel: 'Ranked list',
  className: '',
  caption: none,
  showRankChanges: true,
  formatValue: formatRankedListNumber,
  formatRank: formatRankedListRank,
  formatRankChange: formatRankedListRankChange,
} satisfies Omit<RankedListProps, 'data'>
