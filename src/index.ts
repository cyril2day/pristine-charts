export { AreaChart } from './area-chart'
export {
  DEFAULT_AREA_CHART_VIEW_PROPS,
  computeAreaChart,
  formatAreaChartNumber,
  validateAreaChartInput,
} from './area-chart'
export type {
  AreaChartError,
  AreaChartErrorType,
  AreaChartInput,
  AreaChartPoint,
  AreaChartProps,
  AreaChartResult,
  AreaCoordinateValue,
  Baseline,
  BaselinePoint,
  ClosingEdge,
  FilledRegion,
  SortedDataset as SortedAreaChartDataset,
  ValidatedAreaChartInput,
  ValidatedAreaChartPoint,
  ValidatedBaseline,
  ValidatedDataset as ValidatedAreaChartDataset,
} from './area-chart'
export { BarChart } from './bar-chart'
export {
  DEFAULT_BAR_CHART_VIEW_PROPS,
  DEFAULT_BAR_CHART_ORDER_STRATEGY,
  computeBarChart,
  validateBarChartInput,
} from './bar-chart'
export type {
  AlphabeticalOrderStrategy,
  Bar,
  BarChartDatum,
  BarChartError,
  BarChartErrorType,
  BarChartInput,
  BarChartProps,
  BarChartResult,
  BarDirection,
  ByInsertionOrderStrategy,
  ByValueOrderStrategy,
  Category,
  CustomOrderStrategy,
  OrderStrategy,
  SortDirection,
  ValidatedBarChartDatum,
} from './bar-chart'
export { HistogramChart } from './histogram-chart'
export {
  DEFAULT_HISTOGRAM_CHART_VIEW_PROPS,
  DEFAULT_HISTOGRAM_BIN_STRATEGY,
  computeHistogram,
  validateHistogramInput,
} from './histogram-chart'
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
} from './histogram-chart'
export { LineChart } from './line-chart'
export {
  DEFAULT_LINE_CHART_VIEW_PROPS,
  computeLineChart,
  formatLineChartNumber,
  validateLineChartInput,
} from './line-chart'
export type {
  CoordinateValue,
  LineChartError,
  LineChartErrorType,
  LineChartInput,
  LineChartPoint,
  LineChartProps,
  LineChartResult,
  LineSegment,
  SortedDataset,
  ValidatedDataset as ValidatedLineChartDataset,
  ValidatedLineChartInput,
  ValidatedLineChartPoint,
} from './line-chart'
export { ScatterPlot } from './scatter-plot'
export {
  DEFAULT_SCATTER_PLOT_VIEW_PROPS,
  computeScatterPlot,
  formatScatterPlotNumber,
  validateScatterPlotInput,
} from './scatter-plot'
export type {
  ScatterCoordinateValue,
  ScatterPlotDot,
  ScatterPlotError,
  ScatterPlotErrorType,
  ScatterPlotInput,
  ScatterPlotPoint,
  ScatterPlotProps,
  ScatterPlotResult,
  ValidatedDataset as ValidatedScatterPlotDataset,
  ValidatedScatterPlotInput,
  ValidatedScatterPlotPoint,
} from './scatter-plot'
export {
  andThenResult,
  classNames,
  fromNullable,
  getOrElse,
  isNone,
  isSome,
  mapResult,
  matchOption,
  none,
  some,
} from './shared'
export type { None, Option, OptionMatcher, Some } from './shared'
