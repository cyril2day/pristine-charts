export { FunnelChart } from './FunnelChart'
export {
  DEFAULT_FUNNEL_CHART_VIEW_PROPS,
  formatFunnelChartNumber,
  formatFunnelChartPercentage,
} from './FunnelChart.defaults'
export { computeFunnelChart, validateFunnelChartInput } from './FunnelChart.domain'
export type {
  ConversionRate,
  DropOff,
  DropOffRate,
  FunnelChartDatum,
  FunnelChartError,
  FunnelChartErrorType,
  FunnelChartInput,
  FunnelChartProps,
  FunnelChartResult,
  FunnelStage,
  StageName,
  StageValue,
  ValidatedDataset,
  ValidatedFunnelChartDatum,
} from './FunnelChart.types'
