import type { Option, Result } from '../shared'

export type NumericValue = number

export type ValidatedDataset = readonly NumericValue[]

export type BinCount = number

export type Thresholds = readonly NumericValue[]

export type AutoBinStrategy = {
  readonly kind: 'auto'
  readonly binCount: number
}

export type ManualBinStrategy = {
  readonly kind: 'manual'
  readonly thresholds: readonly number[]
}

export type BinStrategy = AutoBinStrategy | ManualBinStrategy

export type HistogramInput = {
  readonly data: readonly unknown[]
  readonly binStrategy: BinStrategy
}

export type ValidatedHistogramInput = {
  readonly dataset: ValidatedDataset
  readonly binStrategy: ValidatedBinStrategy
}

export type ValidatedAutoBinStrategy = {
  readonly kind: 'auto'
  readonly binCount: BinCount
}

export type ValidatedManualBinStrategy = {
  readonly kind: 'manual'
  readonly thresholds: Thresholds
}

export type ValidatedBinStrategy = ValidatedAutoBinStrategy | ValidatedManualBinStrategy

export type HistogramBin = {
  readonly lowerBound: number
  readonly upperBound: number
  readonly count: number
}

export type HistogramErrorType =
  | 'EmptyDataset'
  | 'NonNumericValue'
  | 'InvalidBinCount'
  | 'InvalidBinBoundaries'
  | 'BoundariesOutsideDatasetRange'

export type HistogramError = {
  readonly type: HistogramErrorType
  readonly message: string
  readonly details: Option<string>
}

export type HistogramResult = Result<readonly HistogramBin[], HistogramError>

export type HistogramChartProps = {
  readonly data: readonly number[]
  readonly binStrategy: BinStrategy
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly showCounts: boolean
  readonly formatBinLabel: (bin: HistogramBin) => string
}
