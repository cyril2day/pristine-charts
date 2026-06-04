import { matchOption, none, some } from '../shared'
import type { Option } from '../shared'
import { always, cond, ifElse, map } from '../shared/fp'

import type { RankChange, RankedEntry } from './RankedList.types'

export type RankChangeDirection = 'Improved' | 'Declined' | 'Unchanged'

export type RankedListValueDirection = 'positive' | 'negative' | 'zero'

export type RankedListModelChange = {
  readonly amount: RankChange
  readonly amountLabel: string
  readonly direction: RankChangeDirection
  readonly directionLabel: string
  readonly directionClassName: string
  readonly ariaLabel: string
}

export type RankedListModelEntry = {
  readonly label: string
  readonly value: number
  readonly rank: number
  readonly rankLabel: string
  readonly valueLabel: string
  readonly valueBarWidth: string
  readonly valueDirectionClassName: RankedListValueDirection
  readonly rankChange: RankedEntry['rankChange']
  readonly change: Option<RankedListModelChange>
  readonly summaryLabel: string
}

export type RankedListModel = {
  readonly entries: readonly RankedListModelEntry[]
}

type RankChangeDirectionRule = [
  (change: RankChange) => boolean,
  (change: RankChange) => RankChangeDirection,
]
type ValueDirectionRule = [
  (value: number) => boolean,
  (value: number) => RankedListValueDirection,
]
type ValueRatioContext = {
  readonly minimumValue: number
  readonly maximumValue: number
  readonly value: number
}

const rankChangeDirectionRules: RankChangeDirectionRule[] = [
  [(change: RankChange) => change > 0, always('Improved')],
  [(change: RankChange) => change < 0, always('Declined')],
  [always(true), always('Unchanged')],
]

const valueDirectionRules: ValueDirectionRule[] = [
  [(value: number) => value > 0, always('positive')],
  [(value: number) => value < 0, always('negative')],
  [always(true), always('zero')],
]

const getRankChangeDirection: (change: RankChange) => RankChangeDirection =
  cond(rankChangeDirectionRules)

const getValueDirection: (value: number) => RankedListValueDirection =
  cond(valueDirectionRules)

const getRankChangeDirectionClassName = (direction: RankChangeDirection) =>
  direction.toLowerCase()

const getRankChangeDirectionLabel = (direction: RankChangeDirection) =>
  cond([
    [(candidate: RankChangeDirection) => candidate === 'Improved', always('Up')],
    [(candidate: RankChangeDirection) => candidate === 'Declined', always('Down')],
    [always(true), always('Same')],
  ])(direction)

const getEntryValue = (entry: RankedEntry) => entry.value

const getValues = (entries: readonly RankedEntry[]) => map(getEntryValue, [...entries])

const hasEntries = (entries: readonly RankedEntry[]) => entries.length > 0

const getMinimumValue = (entries: readonly RankedEntry[]) =>
  ifElse(
    hasEntries,
    (rankedEntries: readonly RankedEntry[]) => Math.min(...getValues(rankedEntries)),
    always(0),
  )(entries)

const getMaximumValue = (entries: readonly RankedEntry[]) =>
  ifElse(
    hasEntries,
    (rankedEntries: readonly RankedEntry[]) => Math.max(...getValues(rankedEntries)),
    always(0),
  )(entries)

const toPercent = (value: number) => `${String(Math.round(value * 1000) / 10)}%`

const hasNoValueRange = (context: ValueRatioContext) =>
  context.minimumValue === context.maximumValue

const computeValueRatio = (context: ValueRatioContext) =>
  (context.value - context.minimumValue) / (context.maximumValue - context.minimumValue)

const getValueRatio = (minimumValue: number, maximumValue: number) => (value: number) =>
  ifElse(
    hasNoValueRange,
    always(1),
    computeValueRatio,
  )({ minimumValue, maximumValue, value })

const pluralizePositions = (count: number) =>
  ifElse(
    (candidate: number) => candidate === 1,
    always('position'),
    always('positions'),
  )(count)

const getChangeAriaLabel = (change: RankChange) => {
  const absoluteChange = Math.abs(change)

  return cond([
    [(candidate: RankChange) => candidate > 0, () =>
      `Rank improved by ${String(absoluteChange)} ${pluralizePositions(absoluteChange)}.`],
    [(candidate: RankChange) => candidate < 0, () =>
      `Rank declined by ${String(absoluteChange)} ${pluralizePositions(absoluteChange)}.`],
    [always(true), () => 'Rank did not change.'],
  ])(change)
}

const buildChangeModel = (
  rankChange: RankChange,
  formatRankChange: (rankChange: number) => string,
): RankedListModelChange => {
  const direction = getRankChangeDirection(rankChange)

  return {
    amount: rankChange,
    amountLabel: formatRankChange(rankChange),
    direction,
    directionLabel: getRankChangeDirectionLabel(direction),
    directionClassName: getRankChangeDirectionClassName(direction),
    ariaLabel: getChangeAriaLabel(rankChange),
  }
}

const getChangeModel = (
  entry: RankedEntry,
  formatRankChange: (rankChange: number) => string,
): Option<RankedListModelChange> =>
  matchOption<RankChange, Option<RankedListModelChange>>(entry.rankChange, {
    none: () => none,
    some: (value) => some(buildChangeModel(value, formatRankChange)),
  })

const getChangeSummary = (change: RankedListModelEntry['change']) =>
  matchOption(change, {
    none: always('No prior rank.'),
    some: (value) => value.ariaLabel,
  })

const toModelEntry = (
  minimumValue: number,
  maximumValue: number,
  formatValue: (value: number) => string,
  formatRank: (rank: number) => string,
  formatRankChange: (rankChange: number) => string,
) => (entry: RankedEntry): RankedListModelEntry => {
  const valueRatio = getValueRatio(minimumValue, maximumValue)(entry.value)
  const rankLabel = formatRank(entry.rank)
  const valueLabel = formatValue(entry.value)
  const change = getChangeModel(entry, formatRankChange)

  return {
    label: entry.label,
    value: entry.value,
    rank: entry.rank,
    rankLabel,
    valueLabel,
    valueBarWidth: toPercent(valueRatio),
    valueDirectionClassName: getValueDirection(entry.value),
    rankChange: entry.rankChange,
    change,
    summaryLabel: `Rank ${rankLabel}, ${entry.label}: ${valueLabel}. ${getChangeSummary(change)}`,
  }
}

export const buildRankedListModel = (
  entries: readonly RankedEntry[],
  formatValue: (value: number) => string,
  formatRank: (rank: number) => string,
  formatRankChange: (rankChange: number) => string,
): RankedListModel => {
  const minimumValue = getMinimumValue(entries)
  const maximumValue = getMaximumValue(entries)

  return {
    entries: map(
      toModelEntry(minimumValue, maximumValue, formatValue, formatRank, formatRankChange),
      [...entries],
    ),
  }
}
