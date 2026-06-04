import { bindResult, err, fromNullable, getOrElse, isNone, mapResult, none, ok, some } from '../shared'
import type { Result } from '../shared'
import {
  all,
  allPass,
  always,
  complement,
  cond,
  defaultTo,
  filter,
  findIndex,
  ifElse,
  isEmpty,
  map,
  pipe,
  prop,
} from '../shared/fp'

import type {
  Bar,
  BarChartDatum,
  BarChartError,
  BarChartInput,
  BarChartResult,
  BarDirection,
  ByValueOrderStrategy,
  CustomOrderStrategy,
  OrderStrategy,
  SortDirection,
  ValidatedDataset,
} from './BarChart.types'

type BarChartInputResult = Result<BarChartInput, BarChartError>
type DatasetResult = Result<ValidatedDataset, BarChartError>
type OrderStrategyResult = Result<OrderStrategy, BarChartError>
type DatasetValidator = [
  (data: readonly BarChartDatum[]) => boolean,
  (data: readonly BarChartDatum[]) => DatasetResult,
]
type OrderStrategyValidator = [
  (input: BarChartInput) => boolean,
  (input: BarChartInput) => OrderStrategyResult,
]
type BarDirectionRule = [
  (value: number) => boolean,
  (value: number) => BarDirection,
]

export const DEFAULT_BAR_CHART_ORDER_STRATEGY: OrderStrategy = {
  kind: 'insertion',
}

const VALUE_ORDER_FALLBACK: SortDirection = 'ascending'

const barChartRules = {
  emptyDataset: (): BarChartError => ({
    type: 'EmptyDataset',
    message: 'A bar chart needs at least one category.',
    details: none,
  }),
  invalidValue: (index: number): BarChartError => ({
    type: 'InvalidValue',
    message: 'Every bar chart value must be a finite number.',
    details: some(`Invalid value at index ${String(index)}.`),
  }),
  duplicateCategory: (category: string): BarChartError => ({
    type: 'DuplicateCategory',
    message: 'Bar chart categories must be unique.',
    details: some(`Duplicate category: ${category}.`),
  }),
  emptyCategoryName: (index: number): BarChartError => ({
    type: 'EmptyCategoryName',
    message: 'Every bar chart category needs a non-empty name.',
    details: some(`Empty category at index ${String(index)}.`),
  }),
  missingValueSortDirection: (): BarChartError => ({
    type: 'MissingValueSortDirection',
    message: 'Sorting by value requires an ascending or descending direction.',
    details: none,
  }),
  missingCategoriesInCustomOrder: (categories: readonly string[]): BarChartError => ({
    type: 'MissingCategoriesInCustomOrder',
    message: 'Custom bar chart ordering must include every category.',
    details: some(`Missing categories: ${categories.join(', ')}.`),
  }),
}

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const isNonEmptyString = (value: string) => value.trim().length > 0

const getCategories = (data: readonly BarChartDatum[]) => map(prop('category'), [...data])

const getValues = (data: readonly BarChartDatum[]) => map(prop('value'), [...data])

const hasOnlyFiniteValues = (data: readonly BarChartDatum[]) =>
  all(isFiniteNumber, getValues(data))

const findInvalidValueIndex = (data: readonly BarChartDatum[]) =>
  findIndex(complement(isFiniteNumber), getValues(data))

const findEmptyCategoryIndex = (data: readonly BarChartDatum[]) =>
  findIndex(complement(isNonEmptyString), getCategories(data))

const hasOnlyNamedCategories = (data: readonly BarChartDatum[]) =>
  all(isNonEmptyString, getCategories(data))

const hasUniqueCategories = (data: readonly BarChartDatum[]) => {
  const categories = getCategories(data)

  return categories.length === new Set(categories).size
}

const findDuplicateCategory = (data: readonly BarChartDatum[]) => {
  const categories = getCategories(data)

  return defaultTo(
    'unknown category',
    categories.find((category, index) => categories.indexOf(category) !== index),
  )
}

const isByValueOrderStrategy = (
  strategy: OrderStrategy,
): strategy is ByValueOrderStrategy => strategy.kind === 'value'

const isCustomOrderStrategy = (
  strategy: OrderStrategy,
): strategy is CustomOrderStrategy => strategy.kind === 'custom'

const getValueOrderDirection = (strategy: OrderStrategy) =>
  ifElse(
    isByValueOrderStrategy,
    (valueStrategy: ByValueOrderStrategy) => fromNullable(valueStrategy.direction),
    always(some(VALUE_ORDER_FALLBACK)),
  )(strategy)

const isMissingValueSortDirection = (strategy: OrderStrategy) =>
  allPass([
    isByValueOrderStrategy,
    pipe(getValueOrderDirection, isNone),
  ])(strategy)

const getCustomOrderCategories = (strategy: OrderStrategy) =>
  ifElse(
    isCustomOrderStrategy,
    (customStrategy: CustomOrderStrategy) => customStrategy.categories,
    always([]),
  )(strategy)

const includesCategory = (categories: readonly string[]) => (category: string) =>
  categories.includes(category)

const getMissingCustomCategories = (
  data: readonly BarChartDatum[],
  strategy: OrderStrategy,
) =>
  filter(
    complement(includesCategory(getCustomOrderCategories(strategy))),
    getCategories(data),
  )

const isMissingCustomCategories = (input: BarChartInput) =>
  allPass([
    (candidate: BarChartInput) => isCustomOrderStrategy(candidate.orderStrategy),
    (candidate: BarChartInput) =>
      complement(isEmpty)(getMissingCustomCategories(candidate.data, candidate.orderStrategy)),
  ])(input)

const datasetValidators: DatasetValidator[] = [
  [isEmpty, () => err(barChartRules.emptyDataset())],
  [
    complement(hasOnlyFiniteValues),
    (candidate: readonly BarChartDatum[]) =>
      err(barChartRules.invalidValue(findInvalidValueIndex(candidate))),
  ],
  [
    complement(hasOnlyNamedCategories),
    (candidate: readonly BarChartDatum[]) =>
      err(barChartRules.emptyCategoryName(findEmptyCategoryIndex(candidate))),
  ],
  [
    complement(hasUniqueCategories),
    (candidate: readonly BarChartDatum[]) =>
      err(barChartRules.duplicateCategory(findDuplicateCategory(candidate))),
  ],
  [always(true), (candidate: readonly BarChartDatum[]) => ok(candidate)],
]

const validateDataset: (data: readonly BarChartDatum[]) => DatasetResult = cond(datasetValidators)

const orderStrategyValidators: OrderStrategyValidator[] = [
  [
    (candidate: BarChartInput) => isMissingValueSortDirection(candidate.orderStrategy),
    () => err(barChartRules.missingValueSortDirection()),
  ],
  [
    isMissingCustomCategories,
    (candidate: BarChartInput) =>
      err(
        barChartRules.missingCategoriesInCustomOrder(
          getMissingCustomCategories(candidate.data, candidate.orderStrategy),
        ),
      ),
  ],
  [always(true), (candidate: BarChartInput) => ok(candidate.orderStrategy)],
]

const validateOrderStrategy: (input: BarChartInput) => OrderStrategyResult =
  cond(orderStrategyValidators)

export function validateBarChartInput(input: BarChartInput): BarChartInputResult {
  return bindResult<
    { readonly data: ValidatedDataset },
    OrderStrategy,
    BarChartInput,
    BarChartError
  >(
    () => validateOrderStrategy(input),
    (context, orderStrategy) => ({ ...context, orderStrategy }),
  )(
    bindResult<object, ValidatedDataset, { readonly data: ValidatedDataset }, BarChartError>(
      () => validateDataset(input.data),
      (_, data) => ({ data }),
    )(ok({})),
  )
}

const byCategory = (left: BarChartDatum, right: BarChartDatum) =>
  left.category.localeCompare(right.category)

const byAscendingValue = (left: BarChartDatum, right: BarChartDatum) =>
  left.value - right.value

const byDescendingValue = (left: BarChartDatum, right: BarChartDatum) =>
  right.value - left.value

const byCustomOrder = (categories: readonly string[]) => (
  left: BarChartDatum,
  right: BarChartDatum,
) => categories.indexOf(left.category) - categories.indexOf(right.category)

const isAlphabeticalOrderStrategy = (strategy: OrderStrategy) =>
  strategy.kind === 'alphabetical'

const isInsertionOrderStrategy = (strategy: OrderStrategy) =>
  strategy.kind === 'insertion'

const isAscendingSortDirection = (direction: SortDirection) => direction === 'ascending'

const getOrderedData = (
  data: readonly BarChartDatum[],
  orderStrategy: OrderStrategy,
) =>
  cond([
    [isInsertionOrderStrategy, always([...data])],
    [isAlphabeticalOrderStrategy, always([...data].sort(byCategory))],
    [
      isByValueOrderStrategy,
      (strategy: ByValueOrderStrategy) =>
        ifElse(
          isAscendingSortDirection,
          always([...data].sort(byAscendingValue)),
          always([...data].sort(byDescendingValue)),
        )(getOrElse<SortDirection>(VALUE_ORDER_FALLBACK)(getValueOrderDirection(strategy))),
    ],
    [
      isCustomOrderStrategy,
      (strategy: CustomOrderStrategy) => [...data].sort(byCustomOrder(strategy.categories)),
    ],
  ])(orderStrategy)

const POSITIVE_DIRECTION: BarDirection = 'positive'
const NEGATIVE_DIRECTION: BarDirection = 'negative'
const ZERO_DIRECTION: BarDirection = 'zero'

const barDirectionRules: BarDirectionRule[] = [
  [(candidate: number) => candidate > 0, always(POSITIVE_DIRECTION)],
  [(candidate: number) => candidate < 0, always(NEGATIVE_DIRECTION)],
  [always(true), always(ZERO_DIRECTION)],
]

const getBarDirection: (value: number) => BarDirection = cond(barDirectionRules)

const toBar = (datum: BarChartDatum): Bar => ({
  ...datum,
  direction: getBarDirection(datum.value),
})

const computeBars = (input: BarChartInput) =>
  map(toBar, getOrderedData(input.data, input.orderStrategy))

export function computeBarChart(input: BarChartInput): BarChartResult {
  return mapResult<BarChartInput, readonly Bar[], BarChartError>(computeBars)(
    validateBarChartInput(input),
  )
}
