import { err, mapResult, ok, some } from '../shared'
import type { Result } from '../shared'
import {
  all,
  allPass,
  always,
  anyPass,
  complement,
  cond,
  filter,
  findIndex,
  ifElse,
} from '../shared/fp'

import type {
  BoxPlotError,
  BoxPlotInput,
  BoxPlotResult,
  FiveNumberSummary,
  SortedDataset,
  ValidatedBoxPlotInput,
  ValidatedDataset,
} from './BoxPlot.types'

type DatasetResult = Result<ValidatedDataset, BoxPlotError>
type BoxPlotInputResult = Result<ValidatedBoxPlotInput, BoxPlotError>
type DatasetValidator = [
  (data: readonly unknown[]) => boolean,
  (data: readonly unknown[]) => DatasetResult,
]

const MINIMUM_VALUE_COUNT = 5
const WHISKER_MULTIPLIER = 1.5

const detailsFromIndex = (index: number) => some(`Invalid value at index ${String(index)}.`)

const boxPlotRules = {
  insufficientData: (count: number): BoxPlotError => ({
    type: 'InsufficientData',
    message: 'A box plot needs at least five numeric values.',
    details: some(`Received ${String(count)}.`),
  }),
  nonNumericValue: (index: number): BoxPlotError => ({
    type: 'NonNumericValue',
    message: 'Every box plot value must be a finite number.',
    details: detailsFromIndex(index),
  }),
}

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const hasEnoughValues = (data: readonly unknown[]) => data.length >= MINIMUM_VALUE_COUNT

const hasOnlyFiniteNumbers = (data: readonly unknown[]) => all(isFiniteNumber, [...data])

const findInvalidNumberIndex = (data: readonly unknown[]) =>
  findIndex(complement(isFiniteNumber), [...data])

const toValidatedDataset = (data: readonly unknown[]): ValidatedDataset =>
  filter((value): value is number => isFiniteNumber(value), [...data])

const datasetValidators: DatasetValidator[] = [
  [
    complement(hasOnlyFiniteNumbers),
    (data: readonly unknown[]) => err(boxPlotRules.nonNumericValue(findInvalidNumberIndex(data))),
  ],
  [
    complement(hasEnoughValues),
    (data: readonly unknown[]) => err(boxPlotRules.insufficientData(data.length)),
  ],
  [always(true), (data: readonly unknown[]) => ok(toValidatedDataset(data))],
]

const validateDataset: (data: readonly unknown[]) => DatasetResult = cond(datasetValidators)

export function validateBoxPlotInput(input: BoxPlotInput): BoxPlotInputResult {
  return mapResult<ValidatedDataset, ValidatedBoxPlotInput, BoxPlotError>(
    (dataset) => ({ dataset }),
  )(validateDataset(input.data))
}

const byAscendingValue = (left: number, right: number) => left - right

const sortDataset = (dataset: ValidatedDataset): SortedDataset =>
  [...dataset].sort(byAscendingValue)

const getMedian = (sortedValues: readonly number[]) => {
  const midpoint = Math.floor(sortedValues.length / 2)

  return ifElse(
    (values: readonly number[]) => values.length % 2 === 0,
    (values: readonly number[]) => (Number(values[midpoint - 1]) + Number(values[midpoint])) / 2,
    (values: readonly number[]) => Number(values[midpoint]),
  )(sortedValues)
}

const getLowerHalf = (sortedValues: SortedDataset) =>
  sortedValues.slice(0, Math.floor(sortedValues.length / 2))

const getUpperHalf = (sortedValues: SortedDataset) =>
  sortedValues.slice(Math.ceil(sortedValues.length / 2))

const isInsideFences = (lowerFence: number, upperFence: number) => (value: number) =>
  allPass([
    (candidate: number) => candidate >= lowerFence,
    (candidate: number) => candidate <= upperFence,
  ])(value)

const isOutsideFences = (lowerFence: number, upperFence: number) => (value: number) =>
  anyPass([
    (candidate: number) => candidate < lowerFence,
    (candidate: number) => candidate > upperFence,
  ])(value)

const getFirstValue = (values: readonly number[]) => Number(values[0])

const getLastValue = (values: readonly number[]) => Number(values[values.length - 1])

const computeSummary = (input: ValidatedBoxPlotInput): FiveNumberSummary => {
  const sortedDataset = sortDataset(input.dataset)
  const q1 = getMedian(getLowerHalf(sortedDataset))
  const median = getMedian(sortedDataset)
  const q3 = getMedian(getUpperHalf(sortedDataset))
  const interquartileRange = q3 - q1
  const lowerFence = q1 - WHISKER_MULTIPLIER * interquartileRange
  const upperFence = q3 + WHISKER_MULTIPLIER * interquartileRange
  const normalValues = filter(isInsideFences(lowerFence, upperFence), [...sortedDataset])

  return {
    q1,
    median,
    q3,
    interquartileRange,
    lowerFence,
    upperFence,
    lowerWhisker: getFirstValue(normalValues),
    upperWhisker: getLastValue(normalValues),
    outliers: filter(isOutsideFences(lowerFence, upperFence), [...sortedDataset]),
  }
}

export function computeBoxPlot(input: BoxPlotInput): BoxPlotResult {
  return mapResult<ValidatedBoxPlotInput, FiveNumberSummary, BoxPlotError>(computeSummary)(
    validateBoxPlotInput(input),
  )
}
