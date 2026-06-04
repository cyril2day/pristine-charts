import { ifElse } from '../shared/fp'

import type { ChangeDirection, KPISummary } from './KPICard.types'

export type KPICardModel = {
  readonly metricName: string
  readonly currentValueLabel: string
  readonly referenceValueLabel: string
  readonly changeAmountLabel: string
  readonly changePercentageLabel: string
  readonly changeDirection: ChangeDirection
  readonly changeDirectionLabel: string
  readonly changeDirectionClassName: string
  readonly comparisonLabel: string
  readonly changeLabel: string
  readonly summaryLabel: string
}

const getChangeDirectionClassName = (direction: ChangeDirection) =>
  direction.toLowerCase()

const getComparisonParts = (comparisonLabel: string) =>
  ifElse(
    (candidate: string) => candidate.trim().length > 0,
    (candidate: string) => [candidate.trim()],
    () => [],
  )(comparisonLabel)

const joinLabels = (parts: readonly string[]) => parts.join(' ')

export const buildKPICardModel = (
  summary: KPISummary,
  comparisonLabel: string,
  formatValue: (value: number) => string,
  formatChangeAmount: (value: number) => string,
  formatChangePercentage: (percentage: number) => string,
): KPICardModel => {
  const currentValueLabel = formatValue(summary.currentValue)
  const referenceValueLabel = formatValue(summary.referenceValue)
  const changeAmountLabel = formatChangeAmount(summary.changeAmount)
  const changePercentageLabel = formatChangePercentage(summary.changePercentage)
  const normalizedComparisonLabel = comparisonLabel.trim()
  const changeDirectionLabel = summary.changeDirection
  const changeLabel = joinLabels([
    changeDirectionLabel,
    changePercentageLabel,
    `(${changeAmountLabel})`,
    ...getComparisonParts(normalizedComparisonLabel),
  ])

  return {
    metricName: summary.metricName,
    currentValueLabel,
    referenceValueLabel,
    changeAmountLabel,
    changePercentageLabel,
    changeDirection: summary.changeDirection,
    changeDirectionLabel,
    changeDirectionClassName: getChangeDirectionClassName(summary.changeDirection),
    comparisonLabel: normalizedComparisonLabel,
    changeLabel,
    summaryLabel: joinLabels([
      `${summary.metricName}:`,
      `${currentValueLabel}.`,
      `${changeLabel}.`,
      `Reference value ${referenceValueLabel}.`,
    ]),
  }
}
