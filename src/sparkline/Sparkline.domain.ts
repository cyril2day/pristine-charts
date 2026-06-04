import { mapResult, none, some } from '../shared'
import type { Result } from '../shared'
import {
  computeLinearSeriesSegments,
  validateLinearSeriesDataset,
} from '../shared/linearSeries'
import type { LinearSeriesErrorRules } from '../shared/linearSeries'

import type {
  SparklineError,
  SparklineInput,
  SparklineResult,
  SparklineSegment,
  ValidatedDataset,
  ValidatedSparklineInput,
} from './Sparkline.types'

type SparklineInputResult = Result<ValidatedSparklineInput, SparklineError>

const sparklineRules: LinearSeriesErrorRules<SparklineError> = {
  insufficientPoints: (): SparklineError => ({
    type: 'InsufficientPoints',
    message: 'A sparkline needs at least two points.',
    details: none,
  }),
  invalidXValue: (index: number): SparklineError => ({
    type: 'InvalidXValue',
    message: 'Every sparkline x value must be a finite number.',
    details: some(`Invalid x value at index ${String(index)}.`),
  }),
  invalidYValue: (index: number): SparklineError => ({
    type: 'InvalidYValue',
    message: 'Every sparkline y value must be a finite number.',
    details: some(`Invalid y value at index ${String(index)}.`),
  }),
  duplicateXValue: (x: number): SparklineError => ({
    type: 'DuplicateXValue',
    message: 'Sparkline x values must be unique.',
    details: some(`Duplicate x value: ${String(x)}.`),
  }),
}

export function validateSparklineInput(input: SparklineInput): SparklineInputResult {
  return mapResult<ValidatedDataset, ValidatedSparklineInput, SparklineError>(
    (dataset) => ({ dataset }),
  )(validateLinearSeriesDataset(input.data, sparklineRules))
}

const computeSegments = (input: ValidatedSparklineInput) =>
  computeLinearSeriesSegments(input.dataset)

export function computeSparkline(input: SparklineInput): SparklineResult {
  return mapResult<ValidatedSparklineInput, readonly SparklineSegment[], SparklineError>(
    computeSegments,
  )(validateSparklineInput(input))
}
