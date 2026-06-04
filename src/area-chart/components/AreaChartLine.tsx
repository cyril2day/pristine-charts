import type { AreaChartModel } from '../AreaChart.model'

type AreaChartLineProps = {
  readonly chart: AreaChartModel
}

export function AreaChartLine({ chart }: AreaChartLineProps) {
  return <path className="pristine-area-chart__line" d={chart.linePath} aria-hidden="true" />
}
