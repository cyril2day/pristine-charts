export const PROGRESS_BAR_MARGIN = {
  top: 30,
  right: 16,
  bottom: 18,
  left: 16,
}

export type ProgressBarModel = {
  readonly currentValue: number
  readonly total: number
  readonly ratio: number
  readonly trackX: number
  readonly trackY: number
  readonly trackWidth: number
  readonly trackHeight: number
  readonly trackRadius: number
  readonly fillWidth: number
  readonly valueLabel: string
  readonly percentageLabel: string
  readonly labelY: number
}

const TRACK_HEIGHT = 18

export const buildProgressBarModel = (
  currentValue: number,
  total: number,
  ratio: number,
  width: number,
  height: number,
  formatValue: (value: number) => string,
  formatPercentage: (ratio: number) => string,
): ProgressBarModel => {
  const trackWidth = width - PROGRESS_BAR_MARGIN.left - PROGRESS_BAR_MARGIN.right
  const trackHeight = Math.min(
    TRACK_HEIGHT,
    height - PROGRESS_BAR_MARGIN.top - PROGRESS_BAR_MARGIN.bottom,
  )
  const trackX = PROGRESS_BAR_MARGIN.left
  const trackY = height - PROGRESS_BAR_MARGIN.bottom - trackHeight

  return {
    currentValue,
    total,
    ratio,
    trackX,
    trackY,
    trackWidth,
    trackHeight,
    trackRadius: trackHeight / 2,
    fillWidth: trackWidth * ratio,
    valueLabel: `${formatValue(currentValue)} of ${formatValue(total)}`,
    percentageLabel: formatPercentage(ratio),
    labelY: PROGRESS_BAR_MARGIN.top / 2,
  }
}
