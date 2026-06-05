import { err, getOrElse, isNone, mapResult, none, ok, some } from '../shared'
import type { Result } from '../shared'
import {
  all,
  allPass,
  always,
  complement,
  cond,
  defaultTo,
  findIndex,
  map,
  prop,
} from '../shared/fp'

import type {
  Favourability,
  ValidatedVarianceChartInput,
  VarianceChartError,
  VarianceChartInput,
  VarianceChartResult,
  VarianceEntry,
  VarianceItem,
  VarianceMetricPolarity,
} from './VarianceChart.types'

type VarianceChartInputResult = Result<ValidatedVarianceChartInput, VarianceChartError>
type VarianceChartInputValidator = [
  (input: VarianceChartInput) => boolean,
  (input: VarianceChartInput) => VarianceChartInputResult,
]
type FavourabilityContext = {
  readonly variance: number
  readonly polarity: VarianceMetricPolarity
}
type FavourabilityRule = [
  (context: FavourabilityContext) => boolean,
  (context: FavourabilityContext) => Favourability,
]

export const VARIANCE_HIGHER_IS_BETTER: VarianceMetricPolarity = 'HigherIsBetter'
export const VARIANCE_LOWER_IS_BETTER: VarianceMetricPolarity = 'LowerIsBetter'

const varianceChartRules = {
  emptyDataset: (): VarianceChartError => ({
    type: 'EmptyDataset',
    message: 'A variance chart needs at least one category.',
    details: none,
  }),
  invalidActualValue: (category: string, value: unknown): VarianceChartError => ({
    type: 'InvalidActualValue',
    message: 'Every variance chart actual value must be a finite number.',
    details: some(`Invalid actual value for ${category}: ${String(value)}.`),
  }),
  invalidBudgetValue: (category: string, value: unknown): VarianceChartError => ({
    type: 'InvalidBudgetValue',
    message: 'Every variance chart budget value must be a non-zero finite number.',
    details: some(`Invalid budget value for ${category}: ${String(value)}.`),
  }),
  emptyCategoryName: (index: number): VarianceChartError => ({
    type: 'EmptyCategoryName',
    message: 'Every variance chart category needs a non-empty name.',
    details: some(`Empty category at index ${String(index)}.`),
  }),
  duplicateCategory: (category: string): VarianceChartError => ({
    type: 'DuplicateCategory',
    message: 'Variance chart categories must be unique.',
    details: some(`Duplicate category: ${category}.`),
  }),
  missingMetricPolarity: (): VarianceChartError => ({
    type: 'MissingMetricPolarity',
    message: 'Variance chart polarity must be explicitly provided.',
    details: none,
  }),
}

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const isNonZeroFiniteNumber = (value: unknown) =>
  allPass([
    isFiniteNumber,
    (candidate: unknown) => Number(candidate) !== 0,
  ])(value)

const isNonEmptyString = (value: string) => value.trim().length > 0

const getCategories = (data: readonly VarianceItem[]) => map(prop('category'), [...data])

const hasOnlyFiniteActualValues = (data: readonly VarianceItem[]) =>
  all((item: VarianceItem) => isFiniteNumber(item.actualValue), [...data])

const hasOnlyValidBudgetValues = (data: readonly VarianceItem[]) =>
  all((item: VarianceItem) => isNonZeroFiniteNumber(item.budgetValue), [...data])

const findInvalidActualValueIndex = (data: readonly VarianceItem[]) =>
  findIndex((item: VarianceItem) => complement(isFiniteNumber)(item.actualValue), [...data])

const findInvalidBudgetValueIndex = (data: readonly VarianceItem[]) =>
  findIndex((item: VarianceItem) => complement(isNonZeroFiniteNumber)(item.budgetValue), [...data])

const findEmptyCategoryIndex = (data: readonly VarianceItem[]) =>
  findIndex(complement(isNonEmptyString), getCategories(data))

const hasOnlyNamedCategories = (data: readonly VarianceItem[]) =>
  all(isNonEmptyString, getCategories(data))

const hasUniqueCategories = (data: readonly VarianceItem[]) => {
  const categories = getCategories(data)

  return categories.length === new Set(categories).size
}

const findDuplicateCategory = (data: readonly VarianceItem[]) => {
  const categories = getCategories(data)

  return defaultTo(
    'unknown category',
    categories.find((category, index) => categories.indexOf(category) !== index),
  )
}

const getIndexedItem = (data: readonly VarianceItem[], index: number) =>
  defaultTo({ category: 'unknown category', actualValue: 0, budgetValue: 0 }, data[index])

const toValidatedInput = (input: VarianceChartInput): ValidatedVarianceChartInput => ({
  data: input.data,
  polarity: getOrElse<VarianceMetricPolarity>(VARIANCE_HIGHER_IS_BETTER)(input.polarity),
})

const inputValidators: VarianceChartInputValidator[] = [
  [
    (candidate: VarianceChartInput) => candidate.data.length === 0,
    () => err(varianceChartRules.emptyDataset()),
  ],
  [
    (candidate: VarianceChartInput) => isNone(candidate.polarity),
    () => err(varianceChartRules.missingMetricPolarity()),
  ],
  [
    (candidate: VarianceChartInput) => complement(hasOnlyFiniteActualValues)(candidate.data),
    (candidate: VarianceChartInput) => {
      const item = getIndexedItem(candidate.data, findInvalidActualValueIndex(candidate.data))

      return err(varianceChartRules.invalidActualValue(item.category, item.actualValue))
    },
  ],
  [
    (candidate: VarianceChartInput) => complement(hasOnlyValidBudgetValues)(candidate.data),
    (candidate: VarianceChartInput) => {
      const item = getIndexedItem(candidate.data, findInvalidBudgetValueIndex(candidate.data))

      return err(varianceChartRules.invalidBudgetValue(item.category, item.budgetValue))
    },
  ],
  [
    (candidate: VarianceChartInput) => complement(hasOnlyNamedCategories)(candidate.data),
    (candidate: VarianceChartInput) =>
      err(varianceChartRules.emptyCategoryName(findEmptyCategoryIndex(candidate.data))),
  ],
  [
    (candidate: VarianceChartInput) => complement(hasUniqueCategories)(candidate.data),
    (candidate: VarianceChartInput) =>
      err(varianceChartRules.duplicateCategory(findDuplicateCategory(candidate.data))),
  ],
  [always(true), (input: VarianceChartInput) => ok(toValidatedInput(input))],
]

export const validateVarianceChartInput: (
  input: VarianceChartInput
) => VarianceChartInputResult = cond(inputValidators)

const isHigherIsBetter = (polarity: VarianceMetricPolarity) =>
  polarity === VARIANCE_HIGHER_IS_BETTER

const isLowerIsBetter = (polarity: VarianceMetricPolarity) =>
  polarity === VARIANCE_LOWER_IS_BETTER

const isOnBudget = (context: FavourabilityContext) => context.variance === 0

const isFavourableForHigherIsBetter = (context: FavourabilityContext) =>
  allPass([
    (candidate: FavourabilityContext) => isHigherIsBetter(candidate.polarity),
    (candidate: FavourabilityContext) => candidate.variance > 0,
  ])(context)

const isFavourableForLowerIsBetter = (context: FavourabilityContext) =>
  allPass([
    (candidate: FavourabilityContext) => isLowerIsBetter(candidate.polarity),
    (candidate: FavourabilityContext) => candidate.variance < 0,
  ])(context)

const favourabilityRules: FavourabilityRule[] = [
  [isOnBudget, always('OnBudget')],
  [isFavourableForHigherIsBetter, always('Favourable')],
  [isFavourableForLowerIsBetter, always('Favourable')],
  [always(true), always('Unfavourable')],
]

const deriveFavourability: (context: FavourabilityContext) => Favourability =
  cond(favourabilityRules)

const toVarianceEntry = (polarity: VarianceMetricPolarity) => (
  item: VarianceItem,
): VarianceEntry => {
  const variance = item.actualValue - item.budgetValue

  return {
    ...item,
    category: item.category.trim(),
    variance,
    variancePercentage: (variance / item.budgetValue) * 100,
    favourability: deriveFavourability({ variance, polarity }),
  }
}

const computeEntries = (input: ValidatedVarianceChartInput) =>
  map(toVarianceEntry(input.polarity), [...input.data])

export function computeVarianceChart(input: VarianceChartInput): VarianceChartResult {
  return mapResult<ValidatedVarianceChartInput, readonly VarianceEntry[], VarianceChartError>(
    computeEntries,
  )(validateVarianceChartInput(input))
}
