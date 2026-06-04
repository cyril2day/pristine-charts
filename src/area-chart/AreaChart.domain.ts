import { andThenResult, err, getOrElse, mapResult, none, ok, some } from '../shared'
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
  AreaChartError,
  AreaChartInput,
  AreaChartPoint,
  AreaChartResult,
  Baseline,
  ClosingEdge,
  FilledRegion,
  SortedDataset,
  ValidatedAreaChartInput,
  ValidatedAreaChartPoint,
  ValidatedBaseline,
  ValidatedDataset,
} from './AreaChart.types'

type DatasetResult = Result<ValidatedDataset, AreaChartError>
type AreaChartInputResult = Result<ValidatedAreaChartInput, AreaChartError>
type DatasetValidator = [
  (data: readonly AreaChartPoint[]) => boolean,
  (data: readonly AreaChartPoint[]) => DatasetResult,
]
type BaselineValidator = [
  (input: ValidatedAreaChartInput) => boolean,
  (input: ValidatedAreaChartInput) => AreaChartInputResult,
]

const MINIMUM_POINT_COUNT = 2
const DEFAULT_BASELINE = 0

const areaChartRules = {
  insufficientPoints: (): AreaChartError => ({
    type: 'InsufficientPoints',
    message: 'An area chart needs at least two points.',
    details: none,
  }),
  invalidXValue: (index: number): AreaChartError => ({
    type: 'InvalidXValue',
    message: 'Every area chart x value must be a finite number.',
    details: some(`Invalid x value at index ${String(index)}.`),
  }),
  invalidYValue: (index: number): AreaChartError => ({
    type: 'InvalidYValue',
    message: 'Every area chart y value must be a finite number.',
    details: some(`Invalid y value at index ${String(index)}.`),
  }),
  duplicateXValue: (x: number): AreaChartError => ({
    type: 'DuplicateXValue',
    message: 'Area chart x values must be unique.',
    details: some(`Duplicate x value: ${String(x)}.`),
  }),
  invalidBaseline: (baseline: unknown): AreaChartError => ({
    type: 'InvalidBaseline',
    message: 'The area chart baseline must be a finite number.',
    details: some(`Invalid baseline: ${String(baseline)}.`),
  }),
  baselineExceedsData: (baseline: ValidatedBaseline, minimumYValue: number): AreaChartError => ({
    type: 'BaselineExceedsData',
    message: 'The area chart baseline must be less than or equal to the minimum y value.',
    details: some(
      `Baseline ${String(baseline)} exceeds minimum y value ${String(minimumYValue)}.`,
    ),
  }),
}

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const hasEnoughPoints = (data: readonly AreaChartPoint[]) =>
  data.length >= MINIMUM_POINT_COUNT

const getXValues = (data: readonly AreaChartPoint[]) => map(prop('x'), [...data])

const getYValues = (data: readonly AreaChartPoint[]) => map(prop('y'), [...data])

const hasOnlyFiniteXValues = (data: readonly AreaChartPoint[]) =>
  all(isFiniteNumber, getXValues(data))

const hasOnlyFiniteYValues = (data: readonly AreaChartPoint[]) =>
  all(isFiniteNumber, getYValues(data))

const findInvalidXValueIndex = (data: readonly AreaChartPoint[]) =>
  findIndex(complement(isFiniteNumber), getXValues(data))

const findInvalidYValueIndex = (data: readonly AreaChartPoint[]) =>
  findIndex(complement(isFiniteNumber), getYValues(data))

const hasUniqueXValues = (data: readonly AreaChartPoint[]) => {
  const xValues = getXValues(data)

  return xValues.length === new Set(xValues).size
}

const findDuplicateXValue = (data: readonly AreaChartPoint[]) => {
  const xValues = getXValues(data)

  return defaultTo(
    0,
    xValues.find((xValue, index) => xValues.indexOf(xValue) !== index),
  )
}

const datasetValidators: DatasetValidator[] = [
  [complement(hasEnoughPoints), () => err(areaChartRules.insufficientPoints())],
  [
    complement(hasOnlyFiniteXValues),
    (candidate: readonly AreaChartPoint[]) =>
      err(areaChartRules.invalidXValue(findInvalidXValueIndex(candidate))),
  ],
  [
    complement(hasOnlyFiniteYValues),
    (candidate: readonly AreaChartPoint[]) =>
      err(areaChartRules.invalidYValue(findInvalidYValueIndex(candidate))),
  ],
  [
    complement(hasUniqueXValues),
    (candidate: readonly AreaChartPoint[]) =>
      err(areaChartRules.duplicateXValue(findDuplicateXValue(candidate))),
  ],
  [always(true), (candidate: readonly AreaChartPoint[]) => ok(candidate)],
]

const validateDataset: (data: readonly AreaChartPoint[]) => DatasetResult =
  cond(datasetValidators)

const toEffectiveBaseline = getOrElse<Baseline>(DEFAULT_BASELINE)

const hasFiniteBaseline = (input: ValidatedAreaChartInput) => isFiniteNumber(input.baseline)

const getMinimumYValue = (dataset: ValidatedDataset) =>
  Math.min(...map(prop('y'), [...dataset]))

const hasCoherentBaseline = (input: ValidatedAreaChartInput) =>
  input.baseline <= getMinimumYValue(input.dataset)

const baselineValidators: BaselineValidator[] = [
  [
    complement(hasFiniteBaseline),
    (input: ValidatedAreaChartInput) => err(areaChartRules.invalidBaseline(input.baseline)),
  ],
  [
    complement(hasCoherentBaseline),
    (input: ValidatedAreaChartInput) =>
      err(areaChartRules.baselineExceedsData(input.baseline, getMinimumYValue(input.dataset))),
  ],
  [always(true), (input: ValidatedAreaChartInput) => ok(input)],
]

const validateBaseline: (input: ValidatedAreaChartInput) => AreaChartInputResult =
  cond(baselineValidators)

export function validateAreaChartInput(input: AreaChartInput): AreaChartInputResult {
  return andThenResult<ValidatedAreaChartInput, ValidatedAreaChartInput, AreaChartError>(
    validateBaseline,
  )(
    mapResult<ValidatedDataset, ValidatedAreaChartInput, AreaChartError>((dataset) => ({
      dataset,
      baseline: toEffectiveBaseline(input.baseline),
    }))(validateDataset(input.data)),
  )
}

const byAscendingX = (left: AreaChartPoint, right: AreaChartPoint) => left.x - right.x

const sortByX = (dataset: ValidatedDataset): SortedDataset => [...dataset].sort(byAscendingX)

const toBaselinePoint = (point: ValidatedAreaChartPoint, baseline: ValidatedBaseline) => ({
  x: point.x,
  y: baseline,
})

const toClosingEdge = (
  point: ValidatedAreaChartPoint,
  baseline: ValidatedBaseline,
): ClosingEdge => ({
  start: point,
  end: toBaselinePoint(point, baseline),
})

const computeFilledRegion = (input: ValidatedAreaChartInput): FilledRegion => {
  const points = sortByX(input.dataset)
  const leftPoint = points[0]
  const rightPoint = points[points.length - 1]

  return {
    points,
    baseline: input.baseline,
    leftClosingEdge: toClosingEdge(leftPoint, input.baseline),
    rightClosingEdge: toClosingEdge(rightPoint, input.baseline),
  }
}

export function computeAreaChart(input: AreaChartInput): AreaChartResult {
  return mapResult<ValidatedAreaChartInput, FilledRegion, AreaChartError>(computeFilledRegion)(
    validateAreaChartInput(input),
  )
}
