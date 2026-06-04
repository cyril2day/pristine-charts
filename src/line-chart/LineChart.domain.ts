import { err, mapResult, none, ok, some } from '../shared'
import type { Result } from '../shared'
import {
  all,
  allPass,
  always,
  aperture,
  complement,
  cond,
  defaultTo,
  findIndex,
  map,
  prop,
} from '../shared/fp'

import type {
  LineChartError,
  LineChartInput,
  LineChartPoint,
  LineChartResult,
  LineSegment,
  SortedDataset,
  ValidatedDataset,
  ValidatedLineChartPoint,
  ValidatedLineChartInput,
} from './LineChart.types'

type DatasetResult = Result<ValidatedDataset, LineChartError>
type LineChartInputResult = Result<ValidatedLineChartInput, LineChartError>
type DatasetValidator = [
  (data: readonly LineChartPoint[]) => boolean,
  (data: readonly LineChartPoint[]) => DatasetResult,
]

const MINIMUM_POINT_COUNT = 2

const lineChartRules = {
  insufficientPoints: (): LineChartError => ({
    type: 'InsufficientPoints',
    message: 'A line chart needs at least two points.',
    details: none,
  }),
  invalidXValue: (index: number): LineChartError => ({
    type: 'InvalidXValue',
    message: 'Every line chart x value must be a finite number.',
    details: some(`Invalid x value at index ${String(index)}.`),
  }),
  invalidYValue: (index: number): LineChartError => ({
    type: 'InvalidYValue',
    message: 'Every line chart y value must be a finite number.',
    details: some(`Invalid y value at index ${String(index)}.`),
  }),
  duplicateXValue: (x: number): LineChartError => ({
    type: 'DuplicateXValue',
    message: 'Line chart x values must be unique.',
    details: some(`Duplicate x value: ${String(x)}.`),
  }),
}

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const hasEnoughPoints = (data: readonly LineChartPoint[]) =>
  data.length >= MINIMUM_POINT_COUNT

const getXValues = (data: readonly LineChartPoint[]) => map(prop('x'), [...data])

const getYValues = (data: readonly LineChartPoint[]) => map(prop('y'), [...data])

const hasOnlyFiniteXValues = (data: readonly LineChartPoint[]) =>
  all(isFiniteNumber, getXValues(data))

const hasOnlyFiniteYValues = (data: readonly LineChartPoint[]) =>
  all(isFiniteNumber, getYValues(data))

const findInvalidXValueIndex = (data: readonly LineChartPoint[]) =>
  findIndex(complement(isFiniteNumber), getXValues(data))

const findInvalidYValueIndex = (data: readonly LineChartPoint[]) =>
  findIndex(complement(isFiniteNumber), getYValues(data))

const hasUniqueXValues = (data: readonly LineChartPoint[]) => {
  const xValues = getXValues(data)

  return xValues.length === new Set(xValues).size
}

const findDuplicateXValue = (data: readonly LineChartPoint[]) => {
  const xValues = getXValues(data)

  return defaultTo(
    0,
    xValues.find((xValue, index) => xValues.indexOf(xValue) !== index),
  )
}

const datasetValidators: DatasetValidator[] = [
  [complement(hasEnoughPoints), () => err(lineChartRules.insufficientPoints())],
  [
    complement(hasOnlyFiniteXValues),
    (candidate: readonly LineChartPoint[]) =>
      err(lineChartRules.invalidXValue(findInvalidXValueIndex(candidate))),
  ],
  [
    complement(hasOnlyFiniteYValues),
    (candidate: readonly LineChartPoint[]) =>
      err(lineChartRules.invalidYValue(findInvalidYValueIndex(candidate))),
  ],
  [
    complement(hasUniqueXValues),
    (candidate: readonly LineChartPoint[]) =>
      err(lineChartRules.duplicateXValue(findDuplicateXValue(candidate))),
  ],
  [always(true), (candidate: readonly LineChartPoint[]) => ok(candidate)],
]

const validateDataset: (data: readonly LineChartPoint[]) => DatasetResult =
  cond(datasetValidators)

export function validateLineChartInput(input: LineChartInput): LineChartInputResult {
  return mapResult<ValidatedDataset, ValidatedLineChartInput, LineChartError>(
    (dataset) => ({ dataset }),
  )(validateDataset(input.data))
}

const byAscendingX = (left: LineChartPoint, right: LineChartPoint) => left.x - right.x

const sortByX = (dataset: ValidatedDataset): SortedDataset => [...dataset].sort(byAscendingX)

type SegmentPair = readonly [ValidatedLineChartPoint, ValidatedLineChartPoint]

const isSegmentPair = (points: readonly ValidatedLineChartPoint[]): points is SegmentPair =>
  points.length === 2

const toLineSegment = ([start, end]: SegmentPair): LineSegment => ({
  start,
  end,
})

const computeSegments = (input: ValidatedLineChartInput) =>
  map(toLineSegment, aperture(2, sortByX(input.dataset)).filter(isSegmentPair))

export function computeLineChart(input: LineChartInput): LineChartResult {
  return mapResult<ValidatedLineChartInput, readonly LineSegment[], LineChartError>(
    computeSegments,
  )(validateLineChartInput(input))
}
