import { err, getOrElse, mapResult, none, ok, some } from '../shared'
import type { Result } from '../shared'
import { allPass, always, complement, cond } from '../shared/fp'

import type {
  ChangeDirection,
  KPICardError,
  KPICardInput,
  KPICardResult,
  KPISummary,
  MetricPolarity,
  ValidatedKPICardInput,
} from './KPICard.types'

type KPICardInputResult = Result<ValidatedKPICardInput, KPICardError>
type KPICardInputValidator = [
  (input: KPICardInput) => boolean,
  (input: KPICardInput) => KPICardInputResult,
]
type ChangeDirectionContext = {
  readonly changeAmount: number
  readonly polarity: MetricPolarity
}
type ChangeDirectionRule = [
  (context: ChangeDirectionContext) => boolean,
  (context: ChangeDirectionContext) => ChangeDirection,
]

export const HIGHER_IS_BETTER: MetricPolarity = 'HigherIsBetter'
export const LOWER_IS_BETTER: MetricPolarity = 'LowerIsBetter'
export const DEFAULT_KPI_CARD_POLARITY: MetricPolarity = HIGHER_IS_BETTER

const kpiCardRules = {
  emptyMetricName: (): KPICardError => ({
    type: 'EmptyMetricName',
    message: 'A KPI card needs a non-empty metric name.',
    details: none,
  }),
  invalidCurrentValue: (currentValue: unknown): KPICardError => ({
    type: 'InvalidCurrentValue',
    message: 'KPI card current value must be a finite number.',
    details: some(`Invalid current value: ${String(currentValue)}.`),
  }),
  invalidReferenceValue: (referenceValue: unknown): KPICardError => ({
    type: 'InvalidReferenceValue',
    message: 'KPI card reference value must be a non-zero finite number.',
    details: some(`Invalid reference value: ${String(referenceValue)}.`),
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

const isNonEmptyString = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'string',
    (candidate: unknown) => String(candidate).trim().length > 0,
  ])(value)

const hasValidMetricName = (input: KPICardInput) => isNonEmptyString(input.metricName)

const hasValidCurrentValue = (input: KPICardInput) => isFiniteNumber(input.currentValue)

const hasValidReferenceValue = (input: KPICardInput) =>
  isNonZeroFiniteNumber(input.referenceValue)

const toValidatedInput = (input: KPICardInput): ValidatedKPICardInput => ({
  metricName: String(input.metricName).trim(),
  currentValue: Number(input.currentValue),
  referenceValue: Number(input.referenceValue),
  polarity: getOrElse<MetricPolarity>(DEFAULT_KPI_CARD_POLARITY)(input.polarity),
})

const inputValidators: KPICardInputValidator[] = [
  [
    complement(hasValidMetricName),
    () => err(kpiCardRules.emptyMetricName()),
  ],
  [
    complement(hasValidCurrentValue),
    (input: KPICardInput) => err(kpiCardRules.invalidCurrentValue(input.currentValue)),
  ],
  [
    complement(hasValidReferenceValue),
    (input: KPICardInput) => err(kpiCardRules.invalidReferenceValue(input.referenceValue)),
  ],
  [always(true), (input: KPICardInput) => ok(toValidatedInput(input))],
]

export const validateKPICardInput: (input: KPICardInput) => KPICardInputResult =
  cond(inputValidators)

const isHigherIsBetter = (polarity: MetricPolarity) => polarity === HIGHER_IS_BETTER

const isLowerIsBetter = (polarity: MetricPolarity) => polarity === LOWER_IS_BETTER

const isUnchanged = (context: ChangeDirectionContext) => context.changeAmount === 0

const isImprovedForHigherIsBetter = (context: ChangeDirectionContext) =>
  allPass([
    (candidate: ChangeDirectionContext) => isHigherIsBetter(candidate.polarity),
    (candidate: ChangeDirectionContext) => candidate.changeAmount > 0,
  ])(context)

const isImprovedForLowerIsBetter = (context: ChangeDirectionContext) =>
  allPass([
    (candidate: ChangeDirectionContext) => isLowerIsBetter(candidate.polarity),
    (candidate: ChangeDirectionContext) => candidate.changeAmount < 0,
  ])(context)

const changeDirectionRules: ChangeDirectionRule[] = [
  [isUnchanged, always('Unchanged')],
  [isImprovedForHigherIsBetter, always('Improved')],
  [isImprovedForLowerIsBetter, always('Improved')],
  [always(true), always('Declined')],
]

const deriveChangeDirection: (context: ChangeDirectionContext) => ChangeDirection =
  cond(changeDirectionRules)

const computeChangeAmount = (input: ValidatedKPICardInput) =>
  input.currentValue - input.referenceValue

const computeChangePercentage = (
  changeAmount: number,
  input: ValidatedKPICardInput,
) => (changeAmount / input.referenceValue) * 100

const toKPISummary = (input: ValidatedKPICardInput): KPISummary => {
  const changeAmount = computeChangeAmount(input)
  const changePercentage = computeChangePercentage(changeAmount, input)

  return {
    metricName: input.metricName,
    currentValue: input.currentValue,
    referenceValue: input.referenceValue,
    changeAmount,
    changePercentage,
    changeDirection: deriveChangeDirection({ changeAmount, polarity: input.polarity }),
  }
}

export function computeKPICard(input: KPICardInput): KPICardResult {
  return mapResult<ValidatedKPICardInput, KPISummary, KPICardError>(toKPISummary)(
    validateKPICardInput(input),
  )
}
