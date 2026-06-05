import type { Option, Result } from '../shared'

export type CurrentValue = number

export type ScaleMinimum = number

export type ScaleMaximum = number

export type ZoneLabel = string

export type PerformanceZone = {
  readonly label: ZoneLabel
  readonly lowerBound: number
  readonly upperBound: number
}

export type ValidatedPerformanceZone = PerformanceZone

export type ScaleRange = {
  readonly minimum: ScaleMinimum
  readonly maximum: ScaleMaximum
}

export type NeedlePosition = number

export type GaugeChartInput = {
  readonly currentValue: unknown
  readonly minimum: unknown
  readonly maximum: unknown
  readonly zones: readonly PerformanceZone[]
}

export type ValidatedGaugeChartInput = {
  readonly currentValue: CurrentValue
  readonly minimum: ScaleMinimum
  readonly maximum: ScaleMaximum
  readonly zones: readonly ValidatedPerformanceZone[]
}

export type GaugeChartSummary = ValidatedGaugeChartInput & {
  readonly scaleRange: ScaleRange
  readonly activeZone: ValidatedPerformanceZone
  readonly needlePosition: NeedlePosition
}

export type GaugeChartErrorType =
  | 'InvalidScaleMinimum'
  | 'InvalidScaleMaximum'
  | 'CurrentValueOutOfRange'
  | 'NoZonesProvided'
  | 'ZonesDoNotCoverScale'
  | 'InvalidZoneBounds'
  | 'EmptyZoneLabel'

export type GaugeChartError = {
  readonly type: GaugeChartErrorType
  readonly message: string
  readonly details: Option<string>
}

export type GaugeChartResult = Result<GaugeChartSummary, GaugeChartError>

export type GaugeChartProps = {
  readonly currentValue: number
  readonly minimum: number
  readonly maximum: number
  readonly zones: readonly PerformanceZone[]
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly showLabels: boolean
  readonly formatValue: (value: number) => string
}
