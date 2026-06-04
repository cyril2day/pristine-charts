import type { LineChartModel } from '../LineChart.model'

type LineChartPathProps = {
  readonly chart: LineChartModel
}

export function LineChartPath({ chart }: LineChartPathProps) {
  return <path className="pristine-line-chart__path" d={chart.path} aria-hidden="true" />
}
