import { err, fromNullable, mapResult, matchOption, none, ok, some } from '../shared'
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
  ConversionRate,
  DropOff,
  DropOffRate,
  FunnelChartDatum,
  FunnelChartError,
  FunnelChartInput,
  FunnelChartResult,
  FunnelStage,
  ValidatedDataset,
} from './FunnelChart.types'

type DatasetResult = Result<ValidatedDataset, FunnelChartError>
type DatasetValidator = [
  (data: readonly FunnelChartDatum[]) => boolean,
  (data: readonly FunnelChartDatum[]) => DatasetResult,
]
type StagePair = readonly [FunnelChartDatum, FunnelChartDatum]

const MINIMUM_STAGE_COUNT = 2

const funnelChartRules = {
  insufficientStages: (): FunnelChartError => ({
    type: 'InsufficientStages',
    message: 'A funnel chart needs at least two stages.',
    details: none,
  }),
  invalidStageValue: (stage: string, value: unknown): FunnelChartError => ({
    type: 'InvalidStageValue',
    message: 'Every funnel chart stage value must be a non-negative finite number.',
    details: some(`Invalid value for stage ${stage}: ${String(value)}.`),
  }),
  monotonicDecreaseViolation: (stage: string, previousStage: string): FunnelChartError => ({
    type: 'MonotonicDecreaseViolation',
    message: 'Funnel chart stage values must not increase as the funnel progresses.',
    details: some(`${stage} is greater than previous stage ${previousStage}.`),
  }),
  emptyStageName: (index: number): FunnelChartError => ({
    type: 'EmptyStageName',
    message: 'Every funnel chart stage needs a non-empty name.',
    details: some(`Empty stage at index ${String(index)}.`),
  }),
  duplicateStageName: (stage: string): FunnelChartError => ({
    type: 'DuplicateStageName',
    message: 'Funnel chart stage names must be unique.',
    details: some(`Duplicate stage: ${stage}.`),
  }),
  zeroInitialValue: (): FunnelChartError => ({
    type: 'ZeroInitialValue',
    message: 'A funnel chart must start with a value greater than zero.',
    details: none,
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

const isNonEmptyString = (value: string) => value.trim().length > 0

const hasEnoughStages = (data: readonly FunnelChartDatum[]) =>
  data.length >= MINIMUM_STAGE_COUNT

const getStages = (data: readonly FunnelChartDatum[]) => map(prop('stage'), [...data])

const getValues = (data: readonly FunnelChartDatum[]) => map(prop('value'), [...data])

const hasOnlyNamedStages = (data: readonly FunnelChartDatum[]) =>
  all(isNonEmptyString, getStages(data))

const findEmptyStageIndex = (data: readonly FunnelChartDatum[]) =>
  findIndex(complement(isNonEmptyString), getStages(data))

const hasOnlyValidValues = (data: readonly FunnelChartDatum[]) =>
  all(isNonNegativeFiniteNumber, getValues(data))

const findInvalidValueStage = (data: readonly FunnelChartDatum[]) =>
  defaultTo(
    { stage: 'unknown stage', value: undefined },
    data.find((datum) => complement(isNonNegativeFiniteNumber)(datum.value)),
  )

const hasUniqueStages = (data: readonly FunnelChartDatum[]) => {
  const stages = getStages(data)

  return stages.length === new Set(stages).size
}

const findDuplicateStage = (data: readonly FunnelChartDatum[]) => {
  const stages = getStages(data)

  return defaultTo(
    'unknown stage',
    stages.find((stage, index) => stages.indexOf(stage) !== index),
  )
}

const firstStageValueIsPositive = (data: readonly FunnelChartDatum[]) => data[0].value > 0

const toStagePair = (data: readonly FunnelChartDatum[]) =>
  (rightStage: FunnelChartDatum, index: number): StagePair => [data[index], rightStage]

const getStagePairs = (data: readonly FunnelChartDatum[]): readonly StagePair[] =>
  data.slice(1).map(toStagePair(data))

const isMonotonicallyNonIncreasing = ([previous, current]: StagePair) =>
  current.value <= previous.value

const hasMonotonicDecrease = (data: readonly FunnelChartDatum[]) =>
  all(isMonotonicallyNonIncreasing, getStagePairs(data))

const firstStagePair = (data: readonly FunnelChartDatum[]): StagePair => [data[0], data[1]]

const findMonotonicViolation = (data: readonly FunnelChartDatum[]) =>
  defaultTo(
    firstStagePair(data),
    getStagePairs(data).find(complement(isMonotonicallyNonIncreasing)),
  )

const datasetValidators: DatasetValidator[] = [
  [complement(hasEnoughStages), () => err(funnelChartRules.insufficientStages())],
  [
    complement(hasOnlyNamedStages),
    (candidate: readonly FunnelChartDatum[]) =>
      err(funnelChartRules.emptyStageName(findEmptyStageIndex(candidate))),
  ],
  [
    complement(hasOnlyValidValues),
    (candidate: readonly FunnelChartDatum[]) => {
      const invalidStage = findInvalidValueStage(candidate)

      return err(funnelChartRules.invalidStageValue(invalidStage.stage, invalidStage.value))
    },
  ],
  [
    complement(hasUniqueStages),
    (candidate: readonly FunnelChartDatum[]) =>
      err(funnelChartRules.duplicateStageName(findDuplicateStage(candidate))),
  ],
  [complement(firstStageValueIsPositive), () => err(funnelChartRules.zeroInitialValue())],
  [
    complement(hasMonotonicDecrease),
    (candidate: readonly FunnelChartDatum[]) => {
      const [previousStage, stage] = findMonotonicViolation(candidate)

      return err(funnelChartRules.monotonicDecreaseViolation(stage.stage, previousStage.stage))
    },
  ],
  [always(true), (candidate: readonly FunnelChartDatum[]) => ok(candidate)],
]

export const validateFunnelChartInput: (
  input: FunnelChartInput
) => DatasetResult = (input: FunnelChartInput) => cond(datasetValidators)(input.data)

const toDropOff = (previous: FunnelChartDatum, current: FunnelChartDatum): DropOff =>
  previous.value - current.value

const previousStageIsZero = (previous: FunnelChartDatum) => previous.value === 0

const toDropOffRate = (previous: FunnelChartDatum, dropOff: DropOff): DropOffRate =>
  ifElse(
    previousStageIsZero,
    always(0),
    (candidate: FunnelChartDatum) => dropOff / candidate.value,
  )(previous)

const toConversionRate = (
  previous: FunnelChartDatum,
  current: FunnelChartDatum,
): ConversionRate =>
  ifElse(
    previousStageIsZero,
    always(1),
    (candidate: FunnelChartDatum) => current.value / candidate.value,
  )(previous)

const toFunnelStage = (data: readonly FunnelChartDatum[]) => (
  datum: FunnelChartDatum,
  index: number,
): FunnelStage => {
  return matchOption<FunnelChartDatum, FunnelStage>(fromNullable(data[index - 1]), {
    none: () => ({
      ...datum,
      index,
      dropOff: none,
      dropOffRate: none,
      conversionRate: none,
    }),
    some: (previousStage) => {
      const dropOff = toDropOff(previousStage, datum)

      return {
        ...datum,
        index,
        dropOff: some(dropOff),
        dropOffRate: some(toDropOffRate(previousStage, dropOff)),
        conversionRate: some(toConversionRate(previousStage, datum)),
      }
    },
  })
}

const computeFunnelStages = (data: ValidatedDataset) => data.map(toFunnelStage(data))

export function computeFunnelChart(input: FunnelChartInput): FunnelChartResult {
  return mapResult<ValidatedDataset, readonly FunnelStage[], FunnelChartError>(
    computeFunnelStages,
  )(validateFunnelChartInput(input))
}
