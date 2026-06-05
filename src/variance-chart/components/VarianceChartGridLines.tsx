import { VARIANCE_CHART_MARGIN } from '../VarianceChart.model'
import type { VarianceChartModel } from '../VarianceChart.model'
import type { VarianceChartProps } from '../VarianceChart.types'
import { always, ifElse } from '@/shared/fp'

type VarianceChartGridLinesProps = Pick<
  VarianceChartProps,
  'displayMode' | 'formatPercentage' | 'formatVariance'
> & {
  readonly chart: VarianceChartModel
  readonly width: number
}

const getTickLabel = (
  displayMode: VarianceChartProps['displayMode'],
  formatVariance: VarianceChartProps['formatVariance'],
  formatPercentage: VarianceChartProps['formatPercentage'],
) => (tick: number) =>
  ifElse(
    (candidate: VarianceChartProps['displayMode']) => candidate === 'percentage',
    always(formatPercentage(tick)),
    always(formatVariance(tick)),
  )(displayMode)

export function VarianceChartGridLines({
  chart,
  displayMode,
  formatPercentage,
  formatVariance,
  width,
}: VarianceChartGridLinesProps) {
  const formatTick = getTickLabel(displayMode, formatVariance, formatPercentage)

  return chart.yTicks.map((tick) => (
    <g className="pristine-variance-chart__grid-line" key={tick}>
      <line
        x1={VARIANCE_CHART_MARGIN.left}
        x2={width - VARIANCE_CHART_MARGIN.right}
        y1={chart.yScale(tick)}
        y2={chart.yScale(tick)}
      />
      <text
        className="pristine-variance-chart__tick-label"
        x={VARIANCE_CHART_MARGIN.left - 8}
        y={chart.yScale(tick)}
        textAnchor="end"
      >
        {formatTick(tick)}
      </text>
    </g>
  ))
}
