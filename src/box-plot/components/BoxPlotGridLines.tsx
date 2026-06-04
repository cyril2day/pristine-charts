import { BOX_PLOT_MARGIN } from '../BoxPlot.model'
import type { BoxPlotModel } from '../BoxPlot.model'

type BoxPlotGridLinesProps = {
  readonly chart: BoxPlotModel
}

export function BoxPlotGridLines({ chart }: BoxPlotGridLinesProps) {
  return chart.xTicks.map((tick) => (
    <g className="pristine-box-plot__grid-line" key={tick}>
      <line
        x1={chart.xScale(tick)}
        x2={chart.xScale(tick)}
        y1={BOX_PLOT_MARGIN.top}
        y2={chart.plotBottom}
      />
    </g>
  ))
}
