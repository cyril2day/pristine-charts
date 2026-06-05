import type { KeyboardEvent } from 'react'

import { classNames, matchOption } from '@/shared'
import { always, ifElse } from '@/shared/fp'

import type { RenderedFunnelStage } from '../FunnelChart.model'

import { FunnelChartSegment } from './FunnelChartSegment'
import { FunnelChartStageLabel } from './FunnelChartStageLabel'
import { FunnelChartValueLabel } from './FunnelChartValueLabel'

type FunnelChartStageProps = {
  readonly active: boolean
  readonly stage: RenderedFunnelStage
  readonly formatValue: (value: number) => string
  readonly formatPercentage: (rate: number) => string
  readonly onActivate: () => void
  readonly onDeactivate: () => void
  readonly showValues: boolean
}

const getAccessibleLabel = (
  stage: RenderedFunnelStage,
  formatValue: (value: number) => string,
  formatPercentage: (rate: number) => string,
) =>
  matchOption(stage.dropOff, {
    none: () => `${stage.stage}: ${formatValue(stage.value)}`,
    some: (dropOff) =>
      `${stage.stage}: ${formatValue(stage.value)}, drop-off ${formatValue(dropOff)}, conversion ${matchOption(
        stage.conversionRate,
        {
          none: () => 'not available',
          some: formatPercentage,
        },
      )}`,
  })

export function FunnelChartStage({
  active,
  stage,
  formatValue,
  formatPercentage,
  onActivate,
  onDeactivate,
  showValues,
}: FunnelChartStageProps) {
  const activeClassName = ifElse(
    always(active),
    always('pristine-funnel-chart__stage--active'),
    always(''),
  )(active)
  const renderValueLabel = ifElse(
    always(showValues),
    () => (
      <FunnelChartValueLabel
        formatPercentage={formatPercentage}
        formatValue={formatValue}
        stage={stage}
      />
    ),
    always(null),
  )
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) =>
    ifElse(
      (candidate: KeyboardEvent<SVGGElement>) => candidate.key === 'Escape',
      () => onDeactivate(),
      always(undefined),
    )(event)

  return (
    <g
      className={classNames([
        'pristine-funnel-chart__stage',
        `pristine-funnel-chart__stage--tone-${String((stage.index % 5) + 1)}`,
        activeClassName,
      ])}
      role="img"
      aria-label={getAccessibleLabel(stage, formatValue, formatPercentage)}
      tabIndex={0}
      onBlur={onDeactivate}
      onClick={onActivate}
      onFocus={onActivate}
      onKeyDown={handleKeyDown}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
    >
      <FunnelChartSegment stage={stage} />
      <FunnelChartStageLabel stage={stage} />
      {renderValueLabel()}
    </g>
  )
}
