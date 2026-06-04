import type { Option, Result } from '../shared'
import type {
  LinearSeriesCoordinateValue,
  LinearSeriesPoint,
  LinearSeriesSegment,
  SortedLinearSeriesDataset,
  ValidatedLinearSeriesDataset,
  ValidatedLinearSeriesPoint,
} from '../shared/linearSeries'

export type SparklineCoordinateValue = LinearSeriesCoordinateValue

export type SparklinePoint = LinearSeriesPoint

export type ValidatedSparklinePoint = ValidatedLinearSeriesPoint

export type ValidatedDataset = ValidatedLinearSeriesDataset

export type SortedDataset = SortedLinearSeriesDataset

export type SparklineSegment = LinearSeriesSegment

export type SparklineInput = {
  readonly data: readonly SparklinePoint[]
}

export type ValidatedSparklineInput = {
  readonly dataset: ValidatedDataset
}

export type SparklineErrorType =
  | 'InsufficientPoints'
  | 'InvalidXValue'
  | 'InvalidYValue'
  | 'DuplicateXValue'

export type SparklineError = {
  readonly type: SparklineErrorType
  readonly message: string
  readonly details: Option<string>
}

export type SparklineResult = Result<readonly SparklineSegment[], SparklineError>

export type SparklineProps = {
  readonly data: readonly SparklinePoint[]
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
}
