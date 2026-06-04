import { mapResult, none, some } from '../shared'
import type { Result } from '../shared'
import {
  computeLinearSeriesSegments,
  validateLinearSeriesDataset,
} from '../shared/linearSeries'
import type { LinearSeriesErrorRules } from '../shared/linearSeries'

import type {
  LineChartError,
  LineChartInput,
  LineChartResult,
  LineSegment,
  ValidatedDataset,
  ValidatedLineChartInput,
} from './LineChart.types'

type LineChartInputResult = Result<ValidatedLineChartInput, LineChartError>

const lineChartRules: LinearSeriesErrorRules<LineChartError> = {
  insufficientPoints: (): LineChartError => ({
    type: 'InsufficientPoints',
    message: 'A line chart needs at least two points.',
    details: none,
  }),
  invalidXValue: (index: number): LineChartError => ({
    type: 'InvalidXValue',
    message: 'Every line chart x value must be a finite number.',
    details: some(`Invalid x value at index ${String(index)}.`),
  }),
  invalidYValue: (index: number): LineChartError => ({
    type: 'InvalidYValue',
    message: 'Every line chart y value must be a finite number.',
    details: some(`Invalid y value at index ${String(index)}.`),
  }),
  duplicateXValue: (x: number): LineChartError => ({
    type: 'DuplicateXValue',
    message: 'Line chart x values must be unique.',
    details: some(`Duplicate x value: ${String(x)}.`),
  }),
}

export function validateLineChartInput(input: LineChartInput): LineChartInputResult {
  return mapResult<ValidatedDataset, ValidatedLineChartInput, LineChartError>(
    (dataset) => ({ dataset }),
  )(validateLinearSeriesDataset(input.data, lineChartRules))
}

const computeSegments = (input: ValidatedLineChartInput) =>
  computeLinearSeriesSegments(input.dataset)

export function computeLineChart(input: LineChartInput): LineChartResult {
  return mapResult<ValidatedLineChartInput, readonly LineSegment[], LineChartError>(
    computeSegments,
  )(validateLineChartInput(input))
}
