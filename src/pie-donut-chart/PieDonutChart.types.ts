import type { Option, Result } from '../shared'

export type Category = string

export type Value = number

export type Proportion = number

export type Radian = number

export type InnerRadius = number

export type PieChartVariant = {
  readonly kind: 'pie'
}

export type DonutChartVariant = {
  readonly kind: 'donut'
  readonly innerRadius: InnerRadius
}

export type ChartVariant = PieChartVariant | DonutChartVariant

export type Slice = {
  readonly category: Category
  readonly value: Value
}

export type ValidatedSlice = Slice

export type ValidatedDataset = readonly ValidatedSlice[]

export type ValidatedChartVariant = ChartVariant

export type Arc = Slice & {
  readonly proportion: Proportion
  readonly startAngle: Radian
  readonly endAngle: Radian
}

export type SegmentedWhole = {
  readonly arcs: readonly Arc[]
  readonly total: Value
  readonly variant: ValidatedChartVariant
}

export type PieDonutChartInput = {
  readonly data: readonly Slice[]
  readonly variant: Option<ChartVariant>
}

export type ValidatedPieDonutChartInput = {
  readonly dataset: ValidatedDataset
  readonly variant: ValidatedChartVariant
}

export type PieDonutChartErrorType =
  | 'InsufficientSlices'
  | 'NonPositiveValue'
  | 'DuplicateCategory'
  | 'EmptyCategoryName'
  | 'InvalidInnerRadius'

export type PieDonutChartError = {
  readonly type: PieDonutChartErrorType
  readonly message: string
  readonly details: Option<string>
}

export type PieDonutChartResult = Result<SegmentedWhole, PieDonutChartError>

export type PieDonutChartProps = {
  readonly data: readonly Slice[]
  readonly variant: Option<ChartVariant>
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly showLabels: boolean
  readonly formatValue: (value: number) => string
  readonly formatPercentage: (proportion: number) => string
}
