import { err, isNone, isSome, mapResult, matchOption, none, ok, some } from '../shared'
import type { Option, Result } from '../shared'
import {
  all,
  allPass,
  always,
  complement,
  cond,
  defaultTo,
  findIndex,
  ifElse,
  map,
  prop,
} from '../shared/fp'

import type {
  PriorRank,
  Rank,
  RankedEntry,
  RankedItem,
  RankedListError,
  RankedListInput,
  RankedListResult,
  ValidatedDataset,
  ValidatedRankedItem,
} from './RankedList.types'

type DatasetResult = Result<ValidatedDataset, RankedListError>
type DatasetValidator = [
  (data: readonly RankedItem[]) => boolean,
  (data: readonly RankedItem[]) => DatasetResult,
]
type RankAccumulator = {
  readonly entries: readonly RankedEntry[]
  readonly previousRank: Rank
  readonly previousValue: Option<number>
}

const rankedListRules = {
  insufficientItems: (): RankedListError => ({
    type: 'InsufficientItems',
    message: 'A ranked list needs at least two items.',
    details: none,
  }),
  invalidValue: (index: number): RankedListError => ({
    type: 'InvalidValue',
    message: 'Every ranked list value must be a finite number.',
    details: some(`Invalid value at index ${String(index)}.`),
  }),
  emptyLabel: (index: number): RankedListError => ({
    type: 'EmptyLabel',
    message: 'Every ranked list item needs a non-empty label.',
    details: some(`Empty label at index ${String(index)}.`),
  }),
  duplicateLabel: (label: string): RankedListError => ({
    type: 'DuplicateLabel',
    message: 'Ranked list labels must be unique.',
    details: some(`Duplicate label: ${label}.`),
  }),
  inconsistentPriorRanks: (): RankedListError => ({
    type: 'InconsistentPriorRanks',
    message: 'Prior ranks must be provided for every ranked list item or for none of them.',
    details: none,
  }),
  invalidPriorRank: (priorRank: unknown): RankedListError => ({
    type: 'InvalidPriorRank',
    message: 'Every ranked list prior rank must be a positive integer.',
    details: some(`Invalid prior rank: ${String(priorRank)}.`),
  }),
}

const MINIMUM_ITEM_COUNT = 2

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const isPositiveInteger = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isInteger(candidate),
    (candidate: unknown) => Number(candidate) > 0,
  ])(value)

const isNonEmptyString = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'string',
    (candidate: unknown) => String(candidate).trim().length > 0,
  ])(value)

const hasInsufficientItems = (data: readonly RankedItem[]) =>
  data.length < MINIMUM_ITEM_COUNT

const getLabels = (data: readonly RankedItem[]) => map(prop('label'), [...data])

const getNormalizedLabels = (data: readonly RankedItem[]) =>
  map((label: string) => label.trim(), getLabels(data))

const getValues = (data: readonly RankedItem[]) => map(prop('value'), [...data])

const getPriorRanks = (data: readonly RankedItem[]) =>
  map((item: RankedItem) => item.priorRank, [...data])

const getPriorRank = (item: RankedItem): ValidatedRankedItem['priorRank'] =>
  item.priorRank

const hasOnlyFiniteValues = (data: readonly RankedItem[]) =>
  all(isFiniteNumber, getValues(data))

const findInvalidValueIndex = (data: readonly RankedItem[]) =>
  findIndex(complement(isFiniteNumber), getValues(data))

const hasOnlyNonEmptyLabels = (data: readonly RankedItem[]) =>
  all(isNonEmptyString, getLabels(data))

const findEmptyLabelIndex = (data: readonly RankedItem[]) =>
  findIndex(complement(isNonEmptyString), getLabels(data))

const hasUniqueLabels = (data: readonly RankedItem[]) => {
  const labels = getNormalizedLabels(data)

  return labels.length === new Set(labels).size
}

const findDuplicateLabel = (data: readonly RankedItem[]) => {
  const labels = getNormalizedLabels(data)

  return defaultTo(
    'unknown label',
    labels.find((label, index) => labels.indexOf(label) !== index),
  )
}

const hasNoPriorRanks = (data: readonly RankedItem[]) =>
  all(isNone, getPriorRanks(data))

const hasAllPriorRanks = (data: readonly RankedItem[]) =>
  all(isSome, getPriorRanks(data))

const hasInconsistentPriorRanks = (data: readonly RankedItem[]) =>
  allPass([complement(hasNoPriorRanks), complement(hasAllPriorRanks)])(data)

const hasValidPriorRank = (item: RankedItem) =>
  matchOption(getPriorRank(item), {
    none: always(true),
    some: isPositiveInteger,
  })

const hasOnlyValidPriorRanks = (data: readonly RankedItem[]) =>
  all(hasValidPriorRank, [...data])

const isRankedItem = (value: RankedItem | undefined): value is RankedItem =>
  value !== undefined

const toRankedItemOption = (value: RankedItem | undefined): Option<RankedItem> =>
  ifElse(
    isRankedItem,
    (item: RankedItem) => some(item),
    always(none),
  )(value)

const getPriorRankDetail = (item: RankedItem) =>
  matchOption<PriorRank, string | PriorRank>(item.priorRank, {
    none: always('missing prior rank'),
    some: (value) => value,
  })

const findInvalidPriorRank = (data: readonly RankedItem[]) =>
  matchOption(toRankedItemOption(data.find(complement(hasValidPriorRank))), {
    none: always('unknown prior rank'),
    some: getPriorRankDetail,
  })

const toValidatedItem = (item: RankedItem): ValidatedRankedItem => ({
  label: item.label.trim(),
  value: item.value,
  priorRank: getPriorRank(item),
})

const datasetValidators: DatasetValidator[] = [
  [hasInsufficientItems, () => err(rankedListRules.insufficientItems())],
  [
    complement(hasOnlyFiniteValues),
    (data: readonly RankedItem[]) =>
      err(rankedListRules.invalidValue(findInvalidValueIndex(data))),
  ],
  [
    complement(hasOnlyNonEmptyLabels),
    (data: readonly RankedItem[]) =>
      err(rankedListRules.emptyLabel(findEmptyLabelIndex(data))),
  ],
  [
    complement(hasUniqueLabels),
    (data: readonly RankedItem[]) => err(rankedListRules.duplicateLabel(findDuplicateLabel(data))),
  ],
  [hasInconsistentPriorRanks, () => err(rankedListRules.inconsistentPriorRanks())],
  [
    complement(hasOnlyValidPriorRanks),
    (data: readonly RankedItem[]) =>
      err(rankedListRules.invalidPriorRank(findInvalidPriorRank(data))),
  ],
  [
    always(true),
    (data: readonly RankedItem[]) => ok(map(toValidatedItem, [...data])),
  ],
]

export const validateRankedListInput: (
  input: RankedListInput
) => DatasetResult = (input: RankedListInput) => cond(datasetValidators)(input.data)

const byDescendingValue = (left: ValidatedRankedItem, right: ValidatedRankedItem) =>
  right.value - left.value

const sortByRank = (data: ValidatedDataset) => [...data].sort(byDescendingValue)

const getRank = (
  item: ValidatedRankedItem,
  index: number,
  previousValue: Option<number>,
  previousRank: Rank,
) =>
  matchOption(previousValue, {
    none: () => index + 1,
    some: (value) =>
      ifElse(
        (candidate: number) => candidate === item.value,
        always(previousRank),
        always(index + 1),
      )(value),
  })

const getRankChange = (rank: Rank) => (
  priorRank: ValidatedRankedItem['priorRank'],
): RankedEntry['rankChange'] =>
  matchOption<PriorRank, RankedEntry['rankChange']>(priorRank, {
    none: () => none,
    some: (value) => some(value - rank),
  })

const toRankedEntry = (rank: Rank) => (item: ValidatedRankedItem): RankedEntry => ({
  label: item.label,
  value: item.value,
  rank,
  rankChange: getRankChange(rank)(item.priorRank),
})

const appendRankedEntry = (
  accumulator: RankAccumulator,
  item: ValidatedRankedItem,
  index: number,
): RankAccumulator => {
  const rank = getRank(item, index, accumulator.previousValue, accumulator.previousRank)

  return {
    entries: [...accumulator.entries, toRankedEntry(rank)(item)],
    previousRank: rank,
    previousValue: some(item.value),
  }
}

const rankItems = (data: ValidatedDataset) =>
  sortByRank(data).reduce<RankAccumulator>(appendRankedEntry, {
    entries: [],
    previousRank: 1,
    previousValue: none,
  }).entries

export function computeRankedList(input: RankedListInput): RankedListResult {
  return mapResult<ValidatedDataset, readonly RankedEntry[], RankedListError>(rankItems)(
    validateRankedListInput(input),
  )
}
