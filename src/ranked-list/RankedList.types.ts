import type { Option, Result } from '../shared'

export type RankedListLabel = string

export type RankedListValue = number

export type Rank = number

export type PriorRank = number

export type RankChange = number

export type RankedItem = {
  readonly label: RankedListLabel
  readonly value: RankedListValue
  readonly priorRank: Option<PriorRank>
}

export type ValidatedRankedItem = {
  readonly label: RankedListLabel
  readonly value: RankedListValue
  readonly priorRank: Option<PriorRank>
}

export type ValidatedDataset = readonly ValidatedRankedItem[]

export type RankedEntry = {
  readonly label: RankedListLabel
  readonly value: RankedListValue
  readonly rank: Rank
  readonly rankChange: Option<RankChange>
}

export type RankedListInput = {
  readonly data: readonly RankedItem[]
}

export type RankedListErrorType =
  | 'InsufficientItems'
  | 'InvalidValue'
  | 'EmptyLabel'
  | 'DuplicateLabel'
  | 'InconsistentPriorRanks'
  | 'InvalidPriorRank'

export type RankedListError = {
  readonly type: RankedListErrorType
  readonly message: string
  readonly details: Option<string>
}

export type RankedListResult = Result<readonly RankedEntry[], RankedListError>

export type RankedListProps = {
  readonly data: readonly RankedItem[]
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly showRankChanges: boolean
  readonly formatValue: (value: number) => string
  readonly formatRank: (rank: number) => string
  readonly formatRankChange: (rankChange: number) => string
}
