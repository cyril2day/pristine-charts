import type { Option, Result } from '../shared'

export type ScatterCoordinateValue = number

export type ScatterPlotPoint = {
  readonly x: ScatterCoordinateValue
  readonly y: ScatterCoordinateValue
}

export type ValidatedScatterPlotPoint = ScatterPlotPoint

export type ValidatedDataset = readonly ValidatedScatterPlotPoint[]

export type ScatterPlotDot = ValidatedScatterPlotPoint & {
  readonly index: number
}

export type ScatterPlotInput = {
  readonly data: readonly ScatterPlotPoint[]
}

export type ValidatedScatterPlotInput = {
  readonly dataset: ValidatedDataset
}

export type ScatterPlotErrorType =
  | 'InsufficientPoints'
  | 'InvalidXValue'
  | 'InvalidYValue'

export type ScatterPlotError = {
  readonly type: ScatterPlotErrorType
  readonly message: string
  readonly details: Option<string>
}

export type ScatterPlotResult = Result<readonly ScatterPlotDot[], ScatterPlotError>

export type ScatterPlotProps = {
  readonly data: readonly ScatterPlotPoint[]
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
}
