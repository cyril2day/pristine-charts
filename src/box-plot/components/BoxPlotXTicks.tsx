import { BOX_PLOT_MARGIN } from '../BoxPlot.model'
import type { BoxPlotModel } from '../BoxPlot.model'

type BoxPlotXTicksProps = {
  readonly chart: BoxPlotModel
  readonly height: number
}

export function BoxPlotXTicks({ chart, height }: BoxPlotXTicksProps) {
  return chart.xTicks.map((tick) => (
    <g className="pristine-box-plot__tick" key={tick}>
      <line
        x1={chart.xScale(tick)}
        x2={chart.xScale(tick)}
        y1={chart.plotBottom}
        y2={chart.plotBottom + 5}
      />
      <text
        x={chart.xScale(tick)}
        y={height - BOX_PLOT_MARGIN.bottom + 18}
        textAnchor="middle"
      >
        {tick}
      </text>
    </g>
  ))
}
