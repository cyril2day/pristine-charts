import type { Option, Result } from '../shared'

export type CoordinateValue = number

export type LineChartPoint = {
  readonly x: CoordinateValue
  readonly y: CoordinateValue
}

export type ValidatedLineChartPoint = LineChartPoint

export type ValidatedDataset = readonly ValidatedLineChartPoint[]

export type SortedDataset = readonly ValidatedLineChartPoint[]

export type LineSegment = {
  readonly start: ValidatedLineChartPoint
  readonly end: ValidatedLineChartPoint
}

export type LineChartInput = {
  readonly data: readonly LineChartPoint[]
}

export type ValidatedLineChartInput = {
  readonly dataset: ValidatedDataset
}

export type LineChartErrorType =
  | 'InsufficientPoints'
  | 'InvalidXValue'
  | 'InvalidYValue'
  | 'DuplicateXValue'

export type LineChartError = {
  readonly type: LineChartErrorType
  readonly message: string
  readonly details: Option<string>
}

export type LineChartResult = Result<readonly LineSegment[], LineChartError>

export type LineChartProps = {
  readonly data: readonly LineChartPoint[]
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly showPoints: boolean
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
}
