import { err, mapResult, ok, some } from '../shared'
import type { Result } from '../shared'
import { allPass, always, complement, cond } from '../shared/fp'

import type {
  ProgressBarError,
  ProgressBarInput,
  ProgressBarResult,
  ValidatedProgressBarInput,
} from './ProgressBar.types'

type ProgressBarInputResult = Result<ValidatedProgressBarInput, ProgressBarError>
type ProgressBarInputValidator = [
  (input: ProgressBarInput) => boolean,
  (input: ProgressBarInput) => ProgressBarInputResult,
]

const progressBarRules = {
  invalidCurrentValue: (currentValue: unknown): ProgressBarError => ({
    type: 'InvalidCurrentValue',
    message: 'Progress bar current value must be a finite number greater than or equal to zero.',
    details: some(`Invalid current value: ${String(currentValue)}.`),
  }),
  invalidTotal: (total: unknown): ProgressBarError => ({
    type: 'InvalidTotal',
    message: 'Progress bar total must be a positive finite number.',
    details: some(`Invalid total: ${String(total)}.`),
  }),
  currentExceedsTotal: (input: ValidatedProgressBarInput): ProgressBarError => ({
    type: 'CurrentExceedsTotal',
    message: 'Progress bar current value cannot exceed the total.',
    details: some(
      `Current value ${String(input.currentValue)} exceeds total ${String(input.total)}.`,
    ),
  }),
}

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const isNonNegativeFiniteNumber = (value: unknown) =>
  allPass([
    isFiniteNumber,
    (candidate: unknown) => Number(candidate) >= 0,
  ])(value)

const isPositiveFiniteNumber = (value: unknown) =>
  allPass([
    isFiniteNumber,
    (candidate: unknown) => Number(candidate) > 0,
  ])(value)

const hasValidCurrentValue = (input: ProgressBarInput) =>
  isNonNegativeFiniteNumber(input.currentValue)

const hasValidTotal = (input: ProgressBarInput) => isPositiveFiniteNumber(input.total)

const toValidatedInput = (input: ProgressBarInput): ValidatedProgressBarInput => ({
  currentValue: Number(input.currentValue),
  total: Number(input.total),
})

const currentExceedsTotal = (input: ValidatedProgressBarInput) =>
  input.currentValue > input.total

const inputValidators: ProgressBarInputValidator[] = [
  [
    complement(hasValidCurrentValue),
    (input: ProgressBarInput) => err(progressBarRules.invalidCurrentValue(input.currentValue)),
  ],
  [
    complement(hasValidTotal),
    (input: ProgressBarInput) => err(progressBarRules.invalidTotal(input.total)),
  ],
  [
    (input: ProgressBarInput) => currentExceedsTotal(toValidatedInput(input)),
    (input: ProgressBarInput) => err(progressBarRules.currentExceedsTotal(toValidatedInput(input))),
  ],
  [always(true), (input: ProgressBarInput) => ok(toValidatedInput(input))],
]

export const validateProgressBarInput: (
  input: ProgressBarInput
) => ProgressBarInputResult = cond(inputValidators)

const computeRatio = (input: ValidatedProgressBarInput) => input.currentValue / input.total

export function computeProgressBar(input: ProgressBarInput): ProgressBarResult {
  return mapResult<ValidatedProgressBarInput, number, ProgressBarError>(computeRatio)(
    validateProgressBarInput(input),
  )
}
