import type { CSSProperties } from 'react'

import { classNames } from '@/shared'

import type { KPICardModel } from '../KPICard.model'
import type { KPICardProps } from '../KPICard.types'

import { KPICardCaption } from './KPICardCaption'

type KPICardStyle = CSSProperties & {
  readonly '--pristine-kpi-card-width': string
  readonly '--pristine-kpi-card-min-height': string
}

type KPICardFigureProps = Pick<
  KPICardProps,
  'ariaLabel' | 'caption' | 'className' | 'height' | 'width'
> & {
  readonly kpi: KPICardModel
}

const toCardStyle = (width: number, height: number): KPICardStyle => ({
  '--pristine-kpi-card-width': `${String(width)}px`,
  '--pristine-kpi-card-min-height': `${String(height)}px`,
})

export function KPICardFigure({
  ariaLabel,
  caption,
  className,
  height,
  kpi,
  width,
}: KPICardFigureProps) {
  const changeClassName = classNames([
    'pristine-kpi-card__change',
    `pristine-kpi-card__change--${kpi.changeDirectionClassName}`,
  ])

  return (
    <figure
      className={classNames(['pristine-kpi-card', className])}
      aria-label={ariaLabel}
      style={toCardStyle(width, height)}
    >
      <div className="pristine-kpi-card__body" role="group" aria-label={kpi.summaryLabel}>
        <p className="pristine-kpi-card__metric">{kpi.metricName}</p>
        <p className="pristine-kpi-card__value">{kpi.currentValueLabel}</p>
        <p className={changeClassName} aria-label={kpi.changeLabel}>
          <span className="pristine-kpi-card__direction">{kpi.changeDirectionLabel}</span>
          <span className="pristine-kpi-card__percentage">
            {kpi.changePercentageLabel}
          </span>
          <span className="pristine-kpi-card__amount">({kpi.changeAmountLabel})</span>
          <span className="pristine-kpi-card__comparison">{kpi.comparisonLabel}</span>
        </p>
      </div>
      <KPICardCaption caption={caption} />
    </figure>
  )
}
