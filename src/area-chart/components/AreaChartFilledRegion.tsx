import type { AreaChartModel } from '../AreaChart.model'

type AreaChartFilledRegionProps = {
  readonly chart: AreaChartModel
}

export function AreaChartFilledRegion({ chart }: AreaChartFilledRegionProps) {
  return <path className="pristine-area-chart__fill" d={chart.fillPath} aria-hidden="true" />
}
