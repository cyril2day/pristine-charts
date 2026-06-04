import { err, mapResult, none, ok, some } from '../shared'
import type { Result } from '../shared'
import {
  all,
  allPass,
  always,
  complement,
  cond,
  findIndex,
  map,
  prop,
} from '../shared/fp'

import type {
  ScatterPlotDot,
  ScatterPlotError,
  ScatterPlotInput,
  ScatterPlotPoint,
  ScatterPlotResult,
  ValidatedDataset,
  ValidatedScatterPlotInput,
} from './ScatterPlot.types'

type DatasetResult = Result<ValidatedDataset, ScatterPlotError>
type ScatterPlotInputResult = Result<ValidatedScatterPlotInput, ScatterPlotError>
type DatasetValidator = [
  (data: readonly ScatterPlotPoint[]) => boolean,
  (data: readonly ScatterPlotPoint[]) => DatasetResult,
]

const MINIMUM_POINT_COUNT = 2

const scatterPlotRules = {
  insufficientPoints: (): ScatterPlotError => ({
    type: 'InsufficientPoints',
    message: 'A scatter plot needs at least two points.',
    details: none,
  }),
  invalidXValue: (index: number): ScatterPlotError => ({
    type: 'InvalidXValue',
    message: 'Every scatter plot x value must be a finite number.',
    details: some(`Invalid x value at index ${String(index)}.`),
  }),
  invalidYValue: (index: number): ScatterPlotError => ({
    type: 'InvalidYValue',
    message: 'Every scatter plot y value must be a finite number.',
    details: some(`Invalid y value at index ${String(index)}.`),
  }),
}

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const hasEnoughPoints = (data: readonly ScatterPlotPoint[]) =>
  data.length >= MINIMUM_POINT_COUNT

const getXValues = (data: readonly ScatterPlotPoint[]) => map(prop('x'), [...data])

const getYValues = (data: readonly ScatterPlotPoint[]) => map(prop('y'), [...data])

const hasOnlyFiniteXValues = (data: readonly ScatterPlotPoint[]) =>
  all(isFiniteNumber, getXValues(data))

const hasOnlyFiniteYValues = (data: readonly ScatterPlotPoint[]) =>
  all(isFiniteNumber, getYValues(data))

const findInvalidXValueIndex = (data: readonly ScatterPlotPoint[]) =>
  findIndex(complement(isFiniteNumber), getXValues(data))

const findInvalidYValueIndex = (data: readonly ScatterPlotPoint[]) =>
  findIndex(complement(isFiniteNumber), getYValues(data))

const datasetValidators: DatasetValidator[] = [
  [complement(hasEnoughPoints), () => err(scatterPlotRules.insufficientPoints())],
  [
    complement(hasOnlyFiniteXValues),
    (candidate: readonly ScatterPlotPoint[]) =>
      err(scatterPlotRules.invalidXValue(findInvalidXValueIndex(candidate))),
  ],
  [
    complement(hasOnlyFiniteYValues),
    (candidate: readonly ScatterPlotPoint[]) =>
      err(scatterPlotRules.invalidYValue(findInvalidYValueIndex(candidate))),
  ],
  [always(true), (candidate: readonly ScatterPlotPoint[]) => ok(candidate)],
]

const validateDataset: (data: readonly ScatterPlotPoint[]) => DatasetResult =
  cond(datasetValidators)

export function validateScatterPlotInput(input: ScatterPlotInput): ScatterPlotInputResult {
  return mapResult<ValidatedDataset, ValidatedScatterPlotInput, ScatterPlotError>(
    (dataset) => ({ dataset }),
  )(validateDataset(input.data))
}

const toScatterPlotDot = (
  point: ValidatedDataset[number],
  index: number,
): ScatterPlotDot => ({
  ...point,
  index,
})

const computeDots = (input: ValidatedScatterPlotInput) =>
  input.dataset.map(toScatterPlotDot)

export function computeScatterPlot(input: ScatterPlotInput): ScatterPlotResult {
  return mapResult<ValidatedScatterPlotInput, readonly ScatterPlotDot[], ScatterPlotError>(
    computeDots,
  )(validateScatterPlotInput(input))
}
