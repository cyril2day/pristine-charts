import { always, ifElse } from '../../shared/fp'
import type { PieDonutChartModel, RenderedArc } from '../PieDonutChart.model'

type PieDonutChartLabelsProps = {
  readonly chart: PieDonutChartModel
  readonly formatPercentage: (proportion: number) => string
  readonly showLabels: boolean
}

const renderLabel = (formatPercentage: (proportion: number) => string) => (arc: RenderedArc) =>
  ifElse(
    (candidate: RenderedArc) => candidate.showLabel,
    (candidate: RenderedArc) => (
      <text
        className="pristine-pie-donut-chart__label"
        key={candidate.category}
        x={candidate.labelX}
        y={candidate.labelY}
        textAnchor={candidate.labelAnchor}
      >
        <tspan x={candidate.labelX} dy="-0.3em">
          {candidate.category}
        </tspan>
        <tspan x={candidate.labelX} dy="1.2em">
          {formatPercentage(candidate.proportion)}
        </tspan>
      </text>
    ),
    always(null),
  )(arc)

export function PieDonutChartLabels({
  chart,
  formatPercentage,
  showLabels,
}: PieDonutChartLabelsProps) {
  return ifElse(
    (candidate: boolean) => candidate,
    () => <g aria-hidden="true">{chart.arcs.map(renderLabel(formatPercentage))}</g>,
    always(null),
  )(showLabels)
}
