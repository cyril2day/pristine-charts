import { BOX_PLOT_MARGIN } from '../BoxPlot.model'
import type { BoxPlotModel } from '../BoxPlot.model'

type BoxPlotAxesProps = {
  readonly chart: BoxPlotModel
  readonly width: number
}

export function BoxPlotAxes({ chart, width }: BoxPlotAxesProps) {
  return (
    <line
      className="pristine-box-plot__axis"
      x1={BOX_PLOT_MARGIN.left}
      x2={width - BOX_PLOT_MARGIN.right}
      y1={chart.plotBottom}
      y2={chart.plotBottom}
    />
  )
}
