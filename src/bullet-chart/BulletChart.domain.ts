import { err, mapResult, none, ok, some } from '../shared'
import type { Result } from '../shared'
import {
  all,
  allPass,
  always,
  anyPass,
  complement,
  cond,
  defaultTo,
  findIndex,
} from '../shared/fp'

import type {
  BulletChartError,
  BulletChartInput,
  BulletChartResult,
  BulletChartSummary,
  PerformanceBand,
  ScaleRange,
  ValidatedBulletChartInput,
  ValidatedPerformanceBand,
} from './BulletChart.types'

type BulletChartInputResult = Result<ValidatedBulletChartInput, BulletChartError>
type BulletChartInputValidator = [
  (input: BulletChartInput) => boolean,
  (input: BulletChartInput) => BulletChartInputResult,
]

const bulletChartRules = {
  invalidCurrentValue: (currentValue: unknown): BulletChartError => ({
    type: 'InvalidCurrentValue',
    message: 'Bullet chart current value must be a finite number.',
    details: some(`Invalid current value: ${String(currentValue)}.`),
  }),
  invalidTargetValue: (targetValue: unknown): BulletChartError => ({
    type: 'InvalidTargetValue',
    message: 'Bullet chart target value must be a finite number.',
    details: some(`Invalid target value: ${String(targetValue)}.`),
  }),
  noBandsProvided: (): BulletChartError => ({
    type: 'NoBandsProvided',
    message: 'A bullet chart needs at least one performance band.',
    details: none,
  }),
  emptyBandLabel: (index: number): BulletChartError => ({
    type: 'EmptyBandLabel',
    message: 'Every bullet chart performance band needs a non-empty label.',
    details: some(`Empty band label at index ${String(index)}.`),
  }),
  invalidBandOrder: (index: number): BulletChartError => ({
    type: 'InvalidBandOrder',
    message: 'Every bullet chart band lower bound must be less than its upper bound.',
    details: some(`Invalid band bounds at index ${String(index)}.`),
  }),
  nonContiguousBands: (index: number): BulletChartError => ({
    type: 'NonContiguousBands',
    message: 'Bullet chart bands must be contiguous and non-overlapping.',
    details: some(`Band at index ${String(index)} does not start at the previous upper bound.`),
  }),
  valueOutsideScale: (valueName: string, value: number, scaleRange: ScaleRange): BulletChartError => ({
    type: 'ValueOutsideScale',
    message: 'Bullet chart values must fall within the performance band scale.',
    details: some(
      `${valueName} ${String(value)} is outside ${String(scaleRange.lowerBound)} to ${String(
        scaleRange.upperBound,
      )}.`,
    ),
  }),
}

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const hasValidCurrentValue = (input: BulletChartInput) =>
  isFiniteNumber(input.currentValue)

const hasValidTargetValue = (input: BulletChartInput) =>
  isFiniteNumber(input.targetValue)

const hasBands = (input: BulletChartInput) => input.bands.length > 0

const hasNonEmptyLabel = (band: PerformanceBand) => band.label.trim().length > 0

const hasOnlyNonEmptyLabels = (input: BulletChartInput) =>
  all(hasNonEmptyLabel, [...input.bands])

const findEmptyBandLabelIndex = (bands: readonly PerformanceBand[]) =>
  findIndex(complement(hasNonEmptyLabel), [...bands])

const hasValidBandOrder = (band: PerformanceBand) =>
  allPass([
    (candidate: PerformanceBand) => isFiniteNumber(candidate.lowerBound),
    (candidate: PerformanceBand) => isFiniteNumber(candidate.upperBound),
    (candidate: PerformanceBand) => candidate.lowerBound < candidate.upperBound,
  ])(band)

const hasOnlyValidBandOrders = (input: BulletChartInput) =>
  all(hasValidBandOrder, [...input.bands])

const findInvalidBandOrderIndex = (bands: readonly PerformanceBand[]) =>
  findIndex(complement(hasValidBandOrder), [...bands])

type BandPair = readonly [PerformanceBand, PerformanceBand]

const toBandPair = (bands: readonly PerformanceBand[]) =>
  (rightBand: PerformanceBand, index: number): BandPair => [bands[index], rightBand]

const getBandPairs = (bands: readonly PerformanceBand[]): readonly BandPair[] =>
  bands.slice(1).map(toBandPair(bands))

const bandsAreContiguous = ([left, right]: BandPair) =>
  left.upperBound === right.lowerBound

const hasContiguousBands = (input: BulletChartInput) =>
  all(bandsAreContiguous, getBandPairs(input.bands))

const findNonContiguousBandIndex = (bands: readonly PerformanceBand[]) =>
  findIndex(
    complement(bandsAreContiguous),
    getBandPairs(bands),
  ) + 1

const toScaleRange = (bands: readonly ValidatedPerformanceBand[]): ScaleRange => ({
  lowerBound: bands[0].lowerBound,
  upperBound: bands[bands.length - 1].upperBound,
})

const isWithinScaleRange = (scaleRange: ScaleRange) =>
  allPass([
    (value: number) => value >= scaleRange.lowerBound,
    (value: number) => value <= scaleRange.upperBound,
  ])

const toValidatedInput = (input: BulletChartInput): ValidatedBulletChartInput => ({
  currentValue: Number(input.currentValue),
  targetValue: Number(input.targetValue),
  bands: input.bands,
})

const currentValueIsWithinScale = (input: BulletChartInput) => {
  const validatedInput = toValidatedInput(input)

  return isWithinScaleRange(toScaleRange(validatedInput.bands))(validatedInput.currentValue)
}

const targetValueIsWithinScale = (input: BulletChartInput) => {
  const validatedInput = toValidatedInput(input)

  return isWithinScaleRange(toScaleRange(validatedInput.bands))(validatedInput.targetValue)
}

const containsCurrentValue =
  (currentValue: number, scaleRange: ScaleRange) => (band: ValidatedPerformanceBand) =>
    allPass([
      (candidate: ValidatedPerformanceBand) => currentValue >= candidate.lowerBound,
      anyPass([
        (candidate: ValidatedPerformanceBand) => currentValue < candidate.upperBound,
        (candidate: ValidatedPerformanceBand) => candidate.upperBound === scaleRange.upperBound,
      ]),
    ])(band)

const getActiveBand = (
  currentValue: number,
  bands: readonly ValidatedPerformanceBand[],
  scaleRange: ScaleRange,
) =>
  defaultTo(
    bands[bands.length - 1],
    bands.find(containsCurrentValue(currentValue, scaleRange)),
  )

const inputValidators: BulletChartInputValidator[] = [
  [
    complement(hasValidCurrentValue),
    (input: BulletChartInput) => err(bulletChartRules.invalidCurrentValue(input.currentValue)),
  ],
  [
    complement(hasValidTargetValue),
    (input: BulletChartInput) => err(bulletChartRules.invalidTargetValue(input.targetValue)),
  ],
  [
    complement(hasBands),
    () => err(bulletChartRules.noBandsProvided()),
  ],
  [
    complement(hasOnlyNonEmptyLabels),
    (input: BulletChartInput) =>
      err(bulletChartRules.emptyBandLabel(findEmptyBandLabelIndex(input.bands))),
  ],
  [
    complement(hasOnlyValidBandOrders),
    (input: BulletChartInput) =>
      err(bulletChartRules.invalidBandOrder(findInvalidBandOrderIndex(input.bands))),
  ],
  [
    complement(hasContiguousBands),
    (input: BulletChartInput) =>
      err(bulletChartRules.nonContiguousBands(findNonContiguousBandIndex(input.bands))),
  ],
  [
    complement(currentValueIsWithinScale),
    (input: BulletChartInput) => {
      const validatedInput = toValidatedInput(input)

      return err(
        bulletChartRules.valueOutsideScale(
          'Current value',
          validatedInput.currentValue,
          toScaleRange(validatedInput.bands),
        ),
      )
    },
  ],
  [
    complement(targetValueIsWithinScale),
    (input: BulletChartInput) => {
      const validatedInput = toValidatedInput(input)

      return err(
        bulletChartRules.valueOutsideScale(
          'Target value',
          validatedInput.targetValue,
          toScaleRange(validatedInput.bands),
        ),
      )
    },
  ],
  [always(true), (input: BulletChartInput) => ok(toValidatedInput(input))],
]

export const validateBulletChartInput: (
  input: BulletChartInput
) => BulletChartInputResult = cond(inputValidators)

const summarizeBulletChart = (input: ValidatedBulletChartInput): BulletChartSummary => {
  const scaleRange = toScaleRange(input.bands)

  return {
    ...input,
    scaleRange,
    activeBand: getActiveBand(input.currentValue, input.bands, scaleRange),
  }
}

export function computeBulletChart(input: BulletChartInput): BulletChartResult {
  return mapResult<ValidatedBulletChartInput, BulletChartSummary, BulletChartError>(
    summarizeBulletChart,
  )(validateBulletChartInput(input))
}
