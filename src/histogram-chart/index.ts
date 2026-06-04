export { HistogramChart } from './HistogramChart'
export { DEFAULT_HISTOGRAM_CHART_VIEW_PROPS } from './HistogramChart.defaults'
export {
  DEFAULT_HISTOGRAM_BIN_STRATEGY,
  computeHistogram,
  validateHistogramInput,
} from './HistogramChart.domain'
export type {
  AutoBinStrategy,
  BinCount,
  BinStrategy,
  HistogramBin,
  HistogramChartProps,
  HistogramError,
  HistogramErrorType,
  HistogramInput,
  HistogramResult,
  ManualBinStrategy,
  NumericValue,
  Thresholds,
  ValidatedBinStrategy,
  ValidatedDataset,
  ValidatedHistogramInput,
} from './HistogramChart.types'
