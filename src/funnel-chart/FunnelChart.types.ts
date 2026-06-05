import type { Option, Result } from '../shared'

export type StageName = string

export type StageValue = number

export type DropOff = number

export type DropOffRate = number

export type ConversionRate = number

export type FunnelChartDatum = {
  readonly stage: StageName
  readonly value: StageValue
}

export type ValidatedFunnelChartDatum = FunnelChartDatum

export type ValidatedDataset = readonly ValidatedFunnelChartDatum[]

export type FunnelStage = FunnelChartDatum & {
  readonly index: number
  readonly dropOff: Option<DropOff>
  readonly dropOffRate: Option<DropOffRate>
  readonly conversionRate: Option<ConversionRate>
}

export type FunnelChartInput = {
  readonly data: readonly FunnelChartDatum[]
}

export type FunnelChartErrorType =
  | 'InsufficientStages'
  | 'InvalidStageValue'
  | 'MonotonicDecreaseViolation'
  | 'EmptyStageName'
  | 'DuplicateStageName'
  | 'ZeroInitialValue'

export type FunnelChartError = {
  readonly type: FunnelChartErrorType
  readonly message: string
  readonly details: Option<string>
}

export type FunnelChartResult = Result<readonly FunnelStage[], FunnelChartError>

export type FunnelChartProps = {
  readonly data: readonly FunnelChartDatum[]
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly showValues: boolean
  readonly formatValue: (value: number) => string
  readonly formatPercentage: (rate: number) => string
}
