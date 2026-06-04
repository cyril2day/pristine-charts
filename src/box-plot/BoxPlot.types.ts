import type { Option, Result } from '../shared'

export type NumericValue = number

export type ValidatedDataset = readonly NumericValue[]

export type SortedDataset = readonly NumericValue[]

export type Outlier = NumericValue

export type FiveNumberSummary = {
  readonly q1: NumericValue
  readonly median: NumericValue
  readonly q3: NumericValue
  readonly interquartileRange: NumericValue
  readonly lowerFence: NumericValue
  readonly upperFence: NumericValue
  readonly lowerWhisker: NumericValue
  readonly upperWhisker: NumericValue
  readonly outliers: readonly Outlier[]
}

export type BoxPlotInput = {
  readonly data: readonly unknown[]
}

export type ValidatedBoxPlotInput = {
  readonly dataset: ValidatedDataset
}

export type BoxPlotErrorType = 'InsufficientData' | 'NonNumericValue'

export type BoxPlotError = {
  readonly type: BoxPlotErrorType
  readonly message: string
  readonly details: Option<string>
}

export type BoxPlotResult = Result<FiveNumberSummary, BoxPlotError>

export type BoxPlotProps = {
  readonly data: readonly number[]
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly formatValue: (value: number) => string
}
