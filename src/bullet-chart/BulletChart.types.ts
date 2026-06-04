import type { Option, Result } from '../shared'

export type CurrentValue = number

export type TargetValue = number

export type BandLabel = string

export type PerformanceBand = {
  readonly label: BandLabel
  readonly lowerBound: number
  readonly upperBound: number
}

export type ValidatedPerformanceBand = PerformanceBand

export type ScaleRange = {
  readonly lowerBound: number
  readonly upperBound: number
}

export type BulletChartInput = {
  readonly currentValue: unknown
  readonly targetValue: unknown
  readonly bands: readonly PerformanceBand[]
}

export type ValidatedBulletChartInput = {
  readonly currentValue: CurrentValue
  readonly targetValue: TargetValue
  readonly bands: readonly ValidatedPerformanceBand[]
}

export type BulletChartSummary = ValidatedBulletChartInput & {
  readonly scaleRange: ScaleRange
  readonly activeBand: ValidatedPerformanceBand
}

export type BulletChartErrorType =
  | 'InvalidCurrentValue'
  | 'InvalidTargetValue'
  | 'NoBandsProvided'
  | 'NonContiguousBands'
  | 'InvalidBandOrder'
  | 'ValueOutsideScale'
  | 'EmptyBandLabel'

export type BulletChartError = {
  readonly type: BulletChartErrorType
  readonly message: string
  readonly details: Option<string>
}

export type BulletChartResult = Result<BulletChartSummary, BulletChartError>

export type BulletChartProps = {
  readonly currentValue: number
  readonly targetValue: number
  readonly bands: readonly PerformanceBand[]
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly showLabels: boolean
  readonly formatValue: (value: number) => string
}
