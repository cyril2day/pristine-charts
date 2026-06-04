import { SCATTER_PLOT_MARGIN } from '../ScatterPlot.model'
import type { ScatterPlotModel } from '../ScatterPlot.model'

type ScatterPlotPlotAreaProps = {
  readonly chart: ScatterPlotModel
  readonly width: number
}

export function ScatterPlotPlotArea({ chart, width }: ScatterPlotPlotAreaProps) {
  return (
    <rect
      className="pristine-scatter-plot__plot"
      x={SCATTER_PLOT_MARGIN.left}
      y={SCATTER_PLOT_MARGIN.top}
      width={width - SCATTER_PLOT_MARGIN.left - SCATTER_PLOT_MARGIN.right}
      height={chart.plotBottom - SCATTER_PLOT_MARGIN.top}
    />
  )
}
