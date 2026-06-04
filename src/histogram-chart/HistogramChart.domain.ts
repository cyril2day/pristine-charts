import { bin as createD3Bin, extent } from 'd3'
import type { Bin } from 'd3'

import { bindResult, err, fromNullable, mapResult, matchOption, none, ok, some } from '../shared'
import type { Result } from '../shared'
import {
  all,
  allPass,
  always,
  anyPass,
  aperture,
  complement,
  cond,
  defaultTo,
  filter,
  findIndex,
  identity,
  ifElse,
  init,
  isEmpty,
  last,
  map,
  tail,
} from '../shared/fp'

import type {
  AutoBinStrategy,
  BinStrategy,
  HistogramBin,
  HistogramError,
  HistogramInput,
  HistogramResult,
  ManualBinStrategy,
  Thresholds,
  ValidatedAutoBinStrategy,
  ValidatedBinStrategy,
  ValidatedDataset,
  ValidatedHistogramInput,
  ValidatedManualBinStrategy,
} from './HistogramChart.types'

type HistogramExtent = [number, number]
type HistogramInputResult = Result<ValidatedHistogramInput, HistogramError>
type DatasetResult = Result<ValidatedDataset, HistogramError>
type BinStrategyResult = Result<ValidatedBinStrategy, HistogramError>
type StrategyMatcher<TOutput> = {
  readonly auto: (strategy: AutoBinStrategy) => TOutput
  readonly manual: (strategy: ManualBinStrategy) => TOutput
}
type ValidatedStrategyMatcher<TOutput> = {
  readonly auto: (strategy: ValidatedAutoBinStrategy) => TOutput
  readonly manual: (strategy: ValidatedManualBinStrategy) => TOutput
}

export const DEFAULT_HISTOGRAM_BIN_STRATEGY: BinStrategy = {
  kind: 'auto',
  binCount: 10,
}

const detailsFromIndex = ifElse(
  (index: number) => index >= 0,
  (index: number) => some(`Invalid value at index ${index}.`),
  always(none),
)

const histogramRules = {
  emptyDataset: (): HistogramError => ({
    type: 'EmptyDataset',
    message: 'A histogram needs at least one numeric value.',
    details: none,
  }),
  nonNumericValue: (index: number): HistogramError => ({
    type: 'NonNumericValue',
    message: 'Every histogram value must be a finite number.',
    details: detailsFromIndex(index),
  }),
  invalidBinCount: (binCount: number): HistogramError => ({
    type: 'InvalidBinCount',
    message: 'Auto bin count must be a positive integer.',
    details: some(`Received ${String(binCount)}.`),
  }),
  invalidBinBoundaries: (): HistogramError => ({
    type: 'InvalidBinBoundaries',
    message: 'Manual thresholds must be finite numbers in strictly ascending order.',
    details: none,
  }),
  boundariesOutsideDatasetRange: (): HistogramError => ({
    type: 'BoundariesOutsideDatasetRange',
    message: 'Manual thresholds must fully cover the dataset range.',
    details: none,
  }),
}

const isFiniteNumber = (value: unknown) =>
  allPass([
    (candidate: unknown) => typeof candidate === 'number',
    (candidate: unknown) => Number.isFinite(candidate),
  ])(value)

const isPositiveInteger = (value: number) =>
  allPass([Number.isInteger, (candidate: number) => candidate > 0])(value)

const isAscendingPair = ([left, right]: readonly number[]) =>
  allPass([
    (candidate: unknown) => Number.isFinite(candidate),
    () => Number.isFinite(right),
    (candidate: unknown) => Number(candidate) < Number(right),
  ])(left)

const areStrictlyAscending = (values: readonly number[]) =>
  all(isAscendingPair, aperture(2, [...values]))

const hasEnoughThresholds = (values: readonly number[]) => values.length >= 2

const hasOnlyFiniteNumbers = (values: readonly unknown[]) => all(isFiniteNumber, [...values])

const findInvalidNumberIndex = (values: readonly unknown[]) =>
  findIndex(complement(isFiniteNumber), [...values])

const toValidatedDataset = (values: readonly unknown[]): ValidatedDataset =>
  filter((value): value is number => isFiniteNumber(value), [...values])

const toThresholds = (values: readonly number[]): Thresholds => filter(isFiniteNumber, [...values])

const isNumber = (value: unknown) => typeof value === 'number'

const withNumberDefault = (fallback: number) => (value: unknown) =>
  matchOption(fromNullable(value), {
    none: () => fallback,
    some: (resolvedValue) =>
      ifElse(
        isNumber,
        (numberValue: number) => defaultTo(fallback, numberValue),
        always(fallback),
      )(resolvedValue),
  })

const getExtent = (values: readonly number[]): HistogramExtent => {
  const [lowerBound, upperBound] = extent(values)

  return [withNumberDefault(0)(lowerBound), withNumberDefault(1)(upperBound)]
}

const isZeroWidthExtent = ([lowerBound, upperBound]: HistogramExtent) => lowerBound === upperBound

const expandZeroWidthExtent = ifElse(
  isZeroWidthExtent,
  ([lowerBound, upperBound]: HistogramExtent): HistogramExtent => [lowerBound - 0.5, upperBound + 0.5],
  identity,
)

const getManualDomain = (thresholds: Thresholds): HistogramExtent => [
  withNumberDefault(0)(thresholds[0]),
  withNumberDefault(1)(last([...thresholds])),
]

const getInteriorThresholds = (thresholds: Thresholds): readonly number[] =>
  init(tail([...thresholds]))

const fullyCoversDataset = (dataset: ValidatedDataset, thresholds: Thresholds) => {
  const [datasetMin, datasetMax] = getExtent(dataset)
  const [thresholdMin, thresholdMax] = getManualDomain(thresholds)

  return all(identity, [
    thresholdMin <= datasetMin,
    thresholdMax >= datasetMax,
  ])
}

type DatasetValidator = [
  (data: readonly unknown[]) => boolean,
  (data: readonly unknown[]) => DatasetResult,
]

const datasetValidators: DatasetValidator[] = [
  [isEmpty, () => err(histogramRules.emptyDataset())],
  [
    complement(hasOnlyFiniteNumbers),
    (data: readonly unknown[]) => err(histogramRules.nonNumericValue(findInvalidNumberIndex(data))),
  ],
  [() => true, (data: readonly unknown[]) => ok(toValidatedDataset(data))],
]

const validateDataset: (data: readonly unknown[]) => DatasetResult = cond(datasetValidators)

const createValidatedAutoStrategy = (binCount: number): ValidatedAutoBinStrategy => ({
  kind: 'auto',
  binCount,
})

const createValidatedManualStrategy = (thresholds: Thresholds): ValidatedManualBinStrategy => ({
  kind: 'manual',
  thresholds,
})

const validateAutoBinStrategy = (binStrategy: AutoBinStrategy): BinStrategyResult =>
  ifElse(
    isPositiveInteger,
    (binCount: number) => ok(createValidatedAutoStrategy(binCount)),
    (binCount: number) => err(histogramRules.invalidBinCount(binCount)),
  )(binStrategy.binCount)

const hasInvalidManualThresholds = anyPass([
  complement(hasEnoughThresholds),
  complement(hasOnlyFiniteNumbers),
  complement(areStrictlyAscending),
])

const validateManualCoverage = (dataset: ValidatedDataset) => (
  binStrategy: ManualBinStrategy,
): BinStrategyResult => {
  const thresholds = toThresholds(binStrategy.thresholds)

  return ifElse(
    (candidate: Thresholds) => fullyCoversDataset(dataset, candidate),
    (candidate: Thresholds) => ok(createValidatedManualStrategy(candidate)),
    () => err(histogramRules.boundariesOutsideDatasetRange()),
  )(thresholds)
}

const validateManualBinStrategy = (
  binStrategy: ManualBinStrategy,
  dataset: ValidatedDataset,
): BinStrategyResult =>
  ifElse(
    (strategy: ManualBinStrategy) => hasInvalidManualThresholds(strategy.thresholds),
    () => err(histogramRules.invalidBinBoundaries()),
    validateManualCoverage(dataset),
  )(binStrategy)

const isAutoStrategy = (strategy: BinStrategy): strategy is AutoBinStrategy => strategy.kind === 'auto'

const isValidatedAutoStrategy = (
  strategy: ValidatedBinStrategy,
): strategy is ValidatedAutoBinStrategy => strategy.kind === 'auto'

const matchBinStrategy = <TOutput>(
  binStrategy: BinStrategy,
  matcher: StrategyMatcher<TOutput>,
) => ifElse(isAutoStrategy, matcher.auto, matcher.manual)(binStrategy)

const matchValidatedBinStrategy = <TOutput>(
  binStrategy: ValidatedBinStrategy,
  matcher: ValidatedStrategyMatcher<TOutput>,
) => ifElse(isValidatedAutoStrategy, matcher.auto, matcher.manual)(binStrategy)

function validateBinStrategy(
  binStrategy: BinStrategy,
  dataset: ValidatedDataset,
): BinStrategyResult {
  return matchBinStrategy(binStrategy, {
    auto: validateAutoBinStrategy,
    manual: (strategy) => validateManualBinStrategy(strategy, dataset),
  })
}

export function validateHistogramInput(input: HistogramInput): HistogramInputResult {
  return bindResult<
    { readonly dataset: ValidatedDataset },
    ValidatedBinStrategy,
    ValidatedHistogramInput,
    HistogramError
  >(
    ({ dataset }) => validateBinStrategy(input.binStrategy, dataset),
    (context, binStrategy) => ({ ...context, binStrategy }),
  )(
    bindResult<object, ValidatedDataset, { readonly dataset: ValidatedDataset }, HistogramError>(
      () => validateDataset(input.data),
      (_, dataset) => ({ dataset }),
    )(ok({})),
  )
}

const isValidD3Bin = (bin: Bin<number, number>) =>
  allPass([
    (candidate: Bin<number, number>) => Number.isFinite(candidate.x0),
    (candidate: Bin<number, number>) => Number.isFinite(candidate.x1),
    (candidate: Bin<number, number>) => Number(candidate.x0) < Number(candidate.x1),
  ])(bin)

const createHistogramBin = (bin: Bin<number, number>): HistogramBin => ({
  lowerBound: Number(bin.x0),
  upperBound: Number(bin.x1),
  count: bin.length,
})

const hasZeroWidthDataset = (dataset: ValidatedDataset) => isZeroWidthExtent(getExtent(dataset))

const computeZeroWidthAutoBins = (dataset: ValidatedDataset) =>
  createD3Bin<number, number>()
    .domain(expandZeroWidthExtent(getExtent(dataset)))
    .thresholds([])([...dataset])

const computeRegularAutoBins = (
  dataset: ValidatedDataset,
  binStrategy: ValidatedAutoBinStrategy,
) =>
  createD3Bin<number, number>()
    .domain(expandZeroWidthExtent(getExtent(dataset)))
    .thresholds(binStrategy.binCount)([...dataset])

const computeAutoBins = (
  dataset: ValidatedDataset,
  binStrategy: ValidatedAutoBinStrategy,
) =>
  ifElse(
    hasZeroWidthDataset,
    computeZeroWidthAutoBins,
    (validDataset: ValidatedDataset) => computeRegularAutoBins(validDataset, binStrategy),
  )(dataset)

const computeManualBins = (
  dataset: ValidatedDataset,
  binStrategy: ValidatedManualBinStrategy,
) =>
  createD3Bin<number, number>()
    .domain(getManualDomain(binStrategy.thresholds))
    .thresholds(getInteriorThresholds(binStrategy.thresholds))([...dataset])

const computeD3Bins = (input: ValidatedHistogramInput) =>
  matchValidatedBinStrategy(input.binStrategy, {
    auto: (strategy) => computeAutoBins(input.dataset, strategy),
    manual: (strategy) => computeManualBins(input.dataset, strategy),
  })

const computeBins = (input: ValidatedHistogramInput) =>
  map(createHistogramBin, filter(isValidD3Bin, computeD3Bins(input)))

export function computeHistogram(input: HistogramInput): HistogramResult {
  return mapResult<ValidatedHistogramInput, readonly HistogramBin[], HistogramError>(computeBins)(
    validateHistogramInput(input),
  )
}
