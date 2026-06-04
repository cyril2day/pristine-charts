import type { HistogramChartModel } from '../HistogramChart.model'

import { HistogramChartBin } from './HistogramChartBin'

type HistogramChartBinsProps = {
  readonly activeBin: string | null
  readonly chart: HistogramChartModel
  readonly onActivate: (bin: string) => void
  readonly onDeactivate: () => void
  readonly showCounts: boolean
}

const getBinKey = (bar: HistogramChartModel['bars'][number]) =>
  `${bar.lowerBound}:${bar.upperBound}`

export function HistogramChartBins({
  activeBin,
  chart,
  onActivate,
  onDeactivate,
  showCounts,
}: HistogramChartBinsProps) {
  return chart.bars.map((bar) => {
    const binKey = getBinKey(bar)

    return (
      <HistogramChartBin
        active={activeBin === binKey}
        bar={bar}
        key={binKey}
        onActivate={() => onActivate(binKey)}
        onDeactivate={onDeactivate}
        showCounts={showCounts}
      />
    )
  })
}
