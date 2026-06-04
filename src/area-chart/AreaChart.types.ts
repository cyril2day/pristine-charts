import type { Option, Result } from '../shared'

export type AreaCoordinateValue = number

export type Baseline = number

export type AreaChartPoint = {
  readonly x: AreaCoordinateValue
  readonly y: AreaCoordinateValue
}

export type ValidatedAreaChartPoint = AreaChartPoint

export type ValidatedDataset = readonly ValidatedAreaChartPoint[]

export type SortedDataset = readonly ValidatedAreaChartPoint[]

export type ValidatedBaseline = Baseline

export type BaselinePoint = {
  readonly x: AreaCoordinateValue
  readonly y: ValidatedBaseline
}

export type ClosingEdge = {
  readonly start: ValidatedAreaChartPoint
  readonly end: BaselinePoint
}

export type FilledRegion = {
  readonly points: SortedDataset
  readonly baseline: ValidatedBaseline
  readonly leftClosingEdge: ClosingEdge
  readonly rightClosingEdge: ClosingEdge
}

export type AreaChartInput = {
  readonly data: readonly AreaChartPoint[]
  readonly baseline: Option<Baseline>
}

export type ValidatedAreaChartInput = {
  readonly dataset: ValidatedDataset
  readonly baseline: ValidatedBaseline
}

export type AreaChartErrorType =
  | 'InsufficientPoints'
  | 'InvalidXValue'
  | 'InvalidYValue'
  | 'DuplicateXValue'
  | 'InvalidBaseline'
  | 'BaselineExceedsData'

export type AreaChartError = {
  readonly type: AreaChartErrorType
  readonly message: string
  readonly details: Option<string>
}

export type AreaChartResult = Result<FilledRegion, AreaChartError>

export type AreaChartProps = {
  readonly data: readonly AreaChartPoint[]
  readonly baseline: Option<Baseline>
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly showPoints: boolean
  readonly formatXValue: (value: number) => string
  readonly formatYValue: (value: number) => string
}
