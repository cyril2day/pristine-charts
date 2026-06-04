import type { Option, Result } from '../shared'
import type {
  LinearSeriesCoordinateValue,
  LinearSeriesPoint,
  LinearSeriesSegment,
  SortedLinearSeriesDataset,
  ValidatedLinearSeriesDataset,
  ValidatedLinearSeriesPoint,
} from '../shared/linearSeries'

export type CoordinateValue = LinearSeriesCoordinateValue

export type LineChartPoint = LinearSeriesPoint

export type ValidatedLineChartPoint = ValidatedLinearSeriesPoint

export type ValidatedDataset = ValidatedLinearSeriesDataset

export type SortedDataset = SortedLinearSeriesDataset

export type LineSegment = LinearSeriesSegment

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
