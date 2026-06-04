import type { Option, Result } from '../shared'

export type MetricName = string

export type CurrentValue = number

export type ReferenceValue = number

export type ChangeAmount = number

export type ChangePercentage = number

export type MetricPolarity = 'HigherIsBetter' | 'LowerIsBetter'

export type ChangeDirection = 'Improved' | 'Declined' | 'Unchanged'

export type KPISummary = {
  readonly metricName: MetricName
  readonly currentValue: CurrentValue
  readonly referenceValue: ReferenceValue
  readonly changeAmount: ChangeAmount
  readonly changePercentage: ChangePercentage
  readonly changeDirection: ChangeDirection
}

export type KPICardInput = {
  readonly metricName: unknown
  readonly currentValue: unknown
  readonly referenceValue: unknown
  readonly polarity: Option<MetricPolarity>
}

export type ValidatedKPICardInput = {
  readonly metricName: MetricName
  readonly currentValue: CurrentValue
  readonly referenceValue: ReferenceValue
  readonly polarity: MetricPolarity
}

export type KPICardErrorType =
  | 'EmptyMetricName'
  | 'InvalidCurrentValue'
  | 'InvalidReferenceValue'

export type KPICardError = {
  readonly type: KPICardErrorType
  readonly message: string
  readonly details: Option<string>
}

export type KPICardResult = Result<KPISummary, KPICardError>

export type KPICardProps = {
  readonly metricName: string
  readonly currentValue: number
  readonly referenceValue: number
  readonly polarity: Option<MetricPolarity>
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly comparisonLabel: string
  readonly formatValue: (value: number) => string
  readonly formatChangeAmount: (value: number) => string
  readonly formatChangePercentage: (percentage: number) => string
}
