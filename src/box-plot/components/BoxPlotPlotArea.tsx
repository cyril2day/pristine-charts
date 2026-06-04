import { BOX_PLOT_MARGIN } from '../BoxPlot.model'
import type { BoxPlotModel } from '../BoxPlot.model'

type BoxPlotPlotAreaProps = {
  readonly chart: BoxPlotModel
  readonly width: number
}

export function BoxPlotPlotArea({ chart, width }: BoxPlotPlotAreaProps) {
  return (
    <rect
      className="pristine-box-plot__plot"
      x={BOX_PLOT_MARGIN.left}
      y={BOX_PLOT_MARGIN.top}
      width={width - BOX_PLOT_MARGIN.left - BOX_PLOT_MARGIN.right}
      height={chart.plotBottom - BOX_PLOT_MARGIN.top}
    />
  )
}
