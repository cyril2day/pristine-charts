import type { Option, Result } from '../shared'

export type CurrentValue = number

export type Total = number

export type Ratio = number

export type ProgressBarInput = {
  readonly currentValue: unknown
  readonly total: unknown
}

export type ValidatedProgressBarInput = {
  readonly currentValue: CurrentValue
  readonly total: Total
}

export type ProgressBarErrorType =
  | 'InvalidCurrentValue'
  | 'InvalidTotal'
  | 'CurrentExceedsTotal'

export type ProgressBarError = {
  readonly type: ProgressBarErrorType
  readonly message: string
  readonly details: Option<string>
}

export type ProgressBarResult = Result<Ratio, ProgressBarError>

export type ProgressBarProps = {
  readonly currentValue: number
  readonly total: number
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly showLabel: boolean
  readonly formatValue: (value: number) => string
  readonly formatPercentage: (ratio: number) => string
}
