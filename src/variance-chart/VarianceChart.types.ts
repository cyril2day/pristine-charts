import type { Option, Result } from '../shared'

export type Category = string

export type ActualValue = number

export type BudgetValue = number

export type Variance = number

export type VariancePercentage = number

export type VarianceMetricPolarity = 'HigherIsBetter' | 'LowerIsBetter'

export type Favourability = 'Favourable' | 'Unfavourable' | 'OnBudget'

export type VarianceDisplayMode = 'absolute' | 'percentage'

export type VarianceItem = {
  readonly category: Category
  readonly actualValue: ActualValue
  readonly budgetValue: BudgetValue
}

export type ValidatedVarianceItem = VarianceItem

export type ValidatedDataset = readonly ValidatedVarianceItem[]

export type VarianceEntry = VarianceItem & {
  readonly variance: Variance
  readonly variancePercentage: VariancePercentage
  readonly favourability: Favourability
}

export type VarianceChartInput = {
  readonly data: readonly VarianceItem[]
  readonly polarity: Option<VarianceMetricPolarity>
}

export type ValidatedVarianceChartInput = {
  readonly data: ValidatedDataset
  readonly polarity: VarianceMetricPolarity
}

export type VarianceChartErrorType =
  | 'EmptyDataset'
  | 'InvalidActualValue'
  | 'InvalidBudgetValue'
  | 'EmptyCategoryName'
  | 'DuplicateCategory'
  | 'MissingMetricPolarity'

export type VarianceChartError = {
  readonly type: VarianceChartErrorType
  readonly message: string
  readonly details: Option<string>
}

export type VarianceChartResult = Result<readonly VarianceEntry[], VarianceChartError>

export type VarianceChartProps = {
  readonly data: readonly VarianceItem[]
  readonly polarity: Option<VarianceMetricPolarity>
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly displayMode: VarianceDisplayMode
  readonly showValues: boolean
  readonly formatValue: (value: number) => string
  readonly formatVariance: (variance: number) => string
  readonly formatPercentage: (percentage: number) => string
}
