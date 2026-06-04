import { formatIntegerOrDecimal } from '../HistogramChart.defaults'
import type { HistogramChartModel } from '../HistogramChart.model'

type HistogramChartXTicksProps = {
  readonly chart: HistogramChartModel
  readonly height: number
}

export function HistogramChartXTicks({ chart, height }: HistogramChartXTicksProps) {
  return chart.xTicks.map((tick) => (
    <g className="pristine-histogram-chart__tick" key={tick}>
      <line
        x1={chart.xScale(tick)}
        x2={chart.xScale(tick)}
        y1={chart.plotBottom}
        y2={chart.plotBottom + 4}
      />
      <text x={chart.xScale(tick)} y={height - 10} textAnchor="middle">
        {formatIntegerOrDecimal(tick)}
      </text>
    </g>
  ))
}
