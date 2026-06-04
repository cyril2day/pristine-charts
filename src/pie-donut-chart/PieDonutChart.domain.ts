import { bindResult, err, getOrElse, mapResult, none, ok, some } from '../shared'
import type { Result } from '../shared'
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
  Arc,
  ChartVariant,
  DonutChartVariant,
  PieDonutChartError,
  PieDonutChartInput,
  PieDonutChartResult,
  SegmentedWhole,
  Slice,
  ValidatedChartVariant,
  ValidatedDataset,
  ValidatedPieDonutChartInput,
} from './PieDonutChart.types'

type DatasetResult = Result<ValidatedDataset, PieDonutChartError>
type VariantResult = Result<ValidatedChartVariant, PieDonutChartError>
type PieDonutChartInputResult = Result<ValidatedPieDonutChartInput, PieDonutChartError>
type DatasetValidator = [
  (data: readonly Slice[]) => boolean,
  (data: readonly Slice[]) => DatasetResult,
]
type VariantValidator = [
  (variant: ChartVariant) => boolean,
  (variant: ChartVariant) => VariantResult,
]

const MINIMUM_SLICE_COUNT = 2
const TAU = Math.PI * 2

export const DEFAULT_PIE_DONUT_CHART_VARIANT: ChartVariant = {
  kind: 'pie',
}

const pieDonutChartRules = {
  insufficientSlices: (): PieDonutChartError => ({
    type: 'InsufficientSlices',
    message: 'A pie or donut chart needs at least two slices.',
    details: none,
  }),
  nonPositiveValue: (category: string): PieDonutChartError => ({
    type: 'NonPositiveValue',
    message: 'Every pie or donut chart value must be a positive finite number.',
    details: some(`Invalid value for category: ${category}.`),
  }),
  duplicateCategory: (category: string): PieDonutChartError => ({
    type: 'DuplicateCategory',
    message: 'Pie and donut chart categories must be unique.',
    details: some(`Duplicate category: ${category}.`),
  }),
  emptyCategoryName: (index: number): PieDonutChartError => ({
    type: 'EmptyCategoryName',
    message: 'Every pie or donut chart category needs a non-empty name.',
    details: some(`Empty category at index ${String(index)}.`),
  }),
  invalidInnerRadius: (innerRadius: unknown): PieDonutChartError => ({
    type: 'InvalidInnerRadius',
    message: 'A donut chart inner radius must be greater than 0 and less than 1.',
    details: some(`Invalid inner radius: ${String(innerRadius)}.`),
  }),
}

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const isPositiveFiniteNumber = (value: unknown) =>
  allPass([
    isFiniteNumber,
    (candidate: unknown) => Number(candidate) > 0,
  ])(value)

const isNonEmptyString = (value: string) => value.trim().length > 0

const hasEnoughSlices = (data: readonly Slice[]) => data.length >= MINIMUM_SLICE_COUNT

const getCategories = (data: readonly Slice[]) => map(prop('category'), [...data])

const getValues = (data: readonly Slice[]) => map(prop('value'), [...data])

const hasOnlyNamedCategories = (data: readonly Slice[]) =>
  all(isNonEmptyString, getCategories(data))

const findEmptyCategoryIndex = (data: readonly Slice[]) =>
  findIndex(complement(isNonEmptyString), getCategories(data))

const hasOnlyPositiveFiniteValues = (data: readonly Slice[]) =>
  all(isPositiveFiniteNumber, getValues(data))

const findInvalidValueCategory = (data: readonly Slice[]) =>
  defaultTo(
    'unknown category',
    data.find((slice) => complement(isPositiveFiniteNumber)(slice.value))?.category,
  )

const hasUniqueCategories = (data: readonly Slice[]) => {
  const categories = getCategories(data)

  return categories.length === new Set(categories).size
}

const findDuplicateCategory = (data: readonly Slice[]) => {
  const categories = getCategories(data)

  return defaultTo(
    'unknown category',
    categories.find((category, index) => categories.indexOf(category) !== index),
  )
}

const isDonutVariant = (variant: ChartVariant): variant is DonutChartVariant =>
  variant.kind === 'donut'

const hasValidDonutInnerRadius = allPass([
  (candidate: DonutChartVariant) => isFiniteNumber(candidate.innerRadius),
  (candidate: DonutChartVariant) => candidate.innerRadius > 0,
  (candidate: DonutChartVariant) => candidate.innerRadius < 1,
])

const hasValidInnerRadius = (variant: ChartVariant) =>
  ifElse(
    isDonutVariant,
    hasValidDonutInnerRadius,
    always(true),
  )(variant)

const getInvalidInnerRadius = (variant: ChartVariant) =>
  ifElse(
    isDonutVariant,
    (candidate: DonutChartVariant) => candidate.innerRadius,
    always(undefined),
  )(variant)

const datasetValidators: DatasetValidator[] = [
  [complement(hasEnoughSlices), () => err(pieDonutChartRules.insufficientSlices())],
  [
    complement(hasOnlyNamedCategories),
    (candidate: readonly Slice[]) =>
      err(pieDonutChartRules.emptyCategoryName(findEmptyCategoryIndex(candidate))),
  ],
  [
    complement(hasOnlyPositiveFiniteValues),
    (candidate: readonly Slice[]) =>
      err(pieDonutChartRules.nonPositiveValue(findInvalidValueCategory(candidate))),
  ],
  [
    complement(hasUniqueCategories),
    (candidate: readonly Slice[]) =>
      err(pieDonutChartRules.duplicateCategory(findDuplicateCategory(candidate))),
  ],
  [always(true), (candidate: readonly Slice[]) => ok(candidate)],
]

const variantValidators: VariantValidator[] = [
  [
    complement(hasValidInnerRadius),
    (candidate: ChartVariant) =>
      err(pieDonutChartRules.invalidInnerRadius(getInvalidInnerRadius(candidate))),
  ],
  [always(true), (candidate: ChartVariant) => ok(candidate)],
]

const validateDataset: (data: readonly Slice[]) => DatasetResult = cond(datasetValidators)

const validateVariant: (variant: ChartVariant) => VariantResult = cond(variantValidators)

const toEffectiveVariant = getOrElse<ChartVariant>(DEFAULT_PIE_DONUT_CHART_VARIANT)

export function validatePieDonutChartInput(
  input: PieDonutChartInput,
): PieDonutChartInputResult {
  return bindResult<
    { readonly dataset: ValidatedDataset },
    ValidatedChartVariant,
    ValidatedPieDonutChartInput,
    PieDonutChartError
  >(
    () => validateVariant(toEffectiveVariant(input.variant)),
    (context, variant) => ({ ...context, variant }),
  )(
    bindResult<object, ValidatedDataset, { readonly dataset: ValidatedDataset }, PieDonutChartError>(
      () => validateDataset(input.data),
      (_, dataset) => ({ dataset }),
    )(ok({})),
  )
}

const sumValues = (data: readonly Slice[]) =>
  data.reduce((total, slice) => total + slice.value, 0)

const toArc = (total: number) => (
  context: { readonly arcs: readonly Arc[]; readonly angle: number },
  slice: Slice,
) => {
  const proportion = slice.value / total
  const startAngle = context.angle
  const endAngle = startAngle + proportion * TAU

  return {
    arcs: [
      ...context.arcs,
      {
        ...slice,
        proportion,
        startAngle,
        endAngle,
      },
    ],
    angle: endAngle,
  }
}

const computeSegmentedWhole = (input: ValidatedPieDonutChartInput): SegmentedWhole => {
  const total = sumValues(input.dataset)
  const arcs = input.dataset.reduce(toArc(total), { arcs: [], angle: 0 }).arcs

  return {
    arcs,
    total,
    variant: input.variant,
  }
}

export function computePieDonutChart(input: PieDonutChartInput): PieDonutChartResult {
  return mapResult<ValidatedPieDonutChartInput, SegmentedWhole, PieDonutChartError>(
    computeSegmentedWhole,
  )(validatePieDonutChartInput(input))
}
