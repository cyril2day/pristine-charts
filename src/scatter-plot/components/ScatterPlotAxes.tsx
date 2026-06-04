import { SCATTER_PLOT_MARGIN } from '../ScatterPlot.model'
import type { ScatterPlotModel } from '../ScatterPlot.model'

type ScatterPlotAxesProps = {
  readonly chart: ScatterPlotModel
  readonly width: number
}

export function ScatterPlotAxes({ chart, width }: ScatterPlotAxesProps) {
  return (
    <>
      <line
        className="pristine-scatter-plot__axis"
        x1={SCATTER_PLOT_MARGIN.left}
        x2={width - SCATTER_PLOT_MARGIN.right}
        y1={chart.plotBottom}
        y2={chart.plotBottom}
      />
      <line
        className="pristine-scatter-plot__axis"
        x1={SCATTER_PLOT_MARGIN.left}
        x2={SCATTER_PLOT_MARGIN.left}
        y1={SCATTER_PLOT_MARGIN.top}
        y2={chart.plotBottom}
      />
    </>
  )
}
