import { err, ok } from './result'
import type { Result } from './result'
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
} from './fp'

export type LinearSeriesCoordinateValue = number

export type LinearSeriesPoint = {
  readonly x: LinearSeriesCoordinateValue
  readonly y: LinearSeriesCoordinateValue
}

export type ValidatedLinearSeriesPoint = LinearSeriesPoint

export type ValidatedLinearSeriesDataset = readonly ValidatedLinearSeriesPoint[]

export type SortedLinearSeriesDataset = readonly ValidatedLinearSeriesPoint[]

export type LinearSeriesSegment = {
  readonly start: ValidatedLinearSeriesPoint
  readonly end: ValidatedLinearSeriesPoint
}

export type LinearSeriesErrorRules<TError> = {
  readonly insufficientPoints: () => TError
  readonly invalidXValue: (index: number) => TError
  readonly invalidYValue: (index: number) => TError
  readonly duplicateXValue: (x: number) => TError
}

type DatasetResult<TError> = Result<ValidatedLinearSeriesDataset, TError>
type DatasetValidator<TError> = [
  (data: readonly LinearSeriesPoint[]) => boolean,
  (data: readonly LinearSeriesPoint[]) => DatasetResult<TError>,
]
type SegmentPair = readonly [ValidatedLinearSeriesPoint, ValidatedLinearSeriesPoint]

const MINIMUM_POINT_COUNT = 2

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const hasEnoughPoints = (data: readonly LinearSeriesPoint[]) =>
  data.length >= MINIMUM_POINT_COUNT

const getXValues = (data: readonly LinearSeriesPoint[]) => map(prop('x'), [...data])

const getYValues = (data: readonly LinearSeriesPoint[]) => map(prop('y'), [...data])

const hasOnlyFiniteXValues = (data: readonly LinearSeriesPoint[]) =>
  all(isFiniteNumber, getXValues(data))

const hasOnlyFiniteYValues = (data: readonly LinearSeriesPoint[]) =>
  all(isFiniteNumber, getYValues(data))

const findInvalidXValueIndex = (data: readonly LinearSeriesPoint[]) =>
  findIndex(complement(isFiniteNumber), getXValues(data))

const findInvalidYValueIndex = (data: readonly LinearSeriesPoint[]) =>
  findIndex(complement(isFiniteNumber), getYValues(data))

const hasUniqueXValues = (data: readonly LinearSeriesPoint[]) => {
  const xValues = getXValues(data)

  return xValues.length === new Set(xValues).size
}

const findDuplicateXValue = (data: readonly LinearSeriesPoint[]) => {
  const xValues = getXValues(data)

  return defaultTo(
    0,
    xValues.find((xValue, index) => xValues.indexOf(xValue) !== index),
  )
}

const byAscendingX = (
  left: ValidatedLinearSeriesPoint,
  right: ValidatedLinearSeriesPoint,
) => left.x - right.x

const sortByX = (
  dataset: ValidatedLinearSeriesDataset,
): SortedLinearSeriesDataset => [...dataset].sort(byAscendingX)

const isSegmentPair = (
  points: readonly ValidatedLinearSeriesPoint[],
): points is SegmentPair => points.length === 2

const toLinearSeriesSegment = ([start, end]: SegmentPair): LinearSeriesSegment => ({
  start,
  end,
})

export const validateLinearSeriesDataset = <TError>(
  data: readonly LinearSeriesPoint[],
  rules: LinearSeriesErrorRules<TError>,
): DatasetResult<TError> => {
  const datasetValidators: DatasetValidator<TError>[] = [
    [complement(hasEnoughPoints), () => err(rules.insufficientPoints())],
    [
      complement(hasOnlyFiniteXValues),
      (candidate: readonly LinearSeriesPoint[]) =>
        err(rules.invalidXValue(findInvalidXValueIndex(candidate))),
    ],
    [
      complement(hasOnlyFiniteYValues),
      (candidate: readonly LinearSeriesPoint[]) =>
        err(rules.invalidYValue(findInvalidYValueIndex(candidate))),
    ],
    [
      complement(hasUniqueXValues),
      (candidate: readonly LinearSeriesPoint[]) =>
        err(rules.duplicateXValue(findDuplicateXValue(candidate))),
    ],
    [always(true), (candidate: readonly LinearSeriesPoint[]) => ok(candidate)],
  ]
  const validateDataset: (candidate: readonly LinearSeriesPoint[]) => DatasetResult<TError> =
    cond(datasetValidators)

  return validateDataset(data)
}

export const computeLinearSeriesSegments = (
  dataset: ValidatedLinearSeriesDataset,
): readonly LinearSeriesSegment[] =>
  map(toLinearSeriesSegment, aperture(2, sortByX(dataset)).filter(isSegmentPair))
