import type { KeyboardEvent, ReactNode } from 'react'

import { classNames } from '@/shared'
import { always, ifElse } from '@/shared/fp'
import type { BoxPlotModel, RenderedBoxPlotPart, RenderedOutlier } from '../BoxPlot.model'

type BoxPlotDistributionProps = {
  readonly activePartKey: string | null
  readonly chart: BoxPlotModel
  readonly onActivate: (partKey: string) => void
  readonly onDeactivate: () => void
}

type InteractivePartProps = {
  readonly activePartKey: string | null
  readonly children: ReactNode
  readonly part: RenderedBoxPlotPart
  readonly onActivate: (partKey: string) => void
  readonly onDeactivate: () => void
}

const getActiveClassName = (active: boolean) =>
  ifElse(
    always(active),
    always('pristine-box-plot__part--active'),
    always(''),
  )(active)

function InteractivePart({
  activePartKey,
  children,
  part,
  onActivate,
  onDeactivate,
}: InteractivePartProps) {
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) =>
    ifElse(
      (candidate: KeyboardEvent<SVGGElement>) => candidate.key === 'Escape',
      () => onDeactivate(),
      always(undefined),
    )(event)

  return (
    <g
      className={classNames([
        'pristine-box-plot__part',
        getActiveClassName(activePartKey === part.key),
      ])}
      role="img"
      aria-label={part.label}
      tabIndex={0}
      onBlur={onDeactivate}
      onClick={() => onActivate(part.key)}
      onFocus={() => onActivate(part.key)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onActivate(part.key)}
      onMouseLeave={onDeactivate}
    >
      {children}
    </g>
  )
}

const getOutlierClassName = (activePartKey: string | null, outlier: RenderedOutlier) =>
  classNames([
    'pristine-box-plot__outlier',
    getActiveClassName(activePartKey === outlier.key),
  ])

const handleOutlierKeyDown = (onDeactivate: () => void) => (event: KeyboardEvent<SVGGElement>) =>
  ifElse(
    (candidate: KeyboardEvent<SVGGElement>) => candidate.key === 'Escape',
    () => onDeactivate(),
    always(undefined),
  )(event)

export function BoxPlotDistribution({
  activePartKey,
  chart,
  onActivate,
  onDeactivate,
}: BoxPlotDistributionProps) {
  return (
    <>
      <InteractivePart
        activePartKey={activePartKey}
        part={chart.lowerWhiskerPart}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
      >
        <line
          className="pristine-box-plot__whisker"
          x1={chart.lowerWhiskerX}
          x2={chart.q1X}
          y1={chart.plotCenter}
          y2={chart.plotCenter}
        />
        <line
          className="pristine-box-plot__whisker-cap"
          x1={chart.lowerWhiskerX}
          x2={chart.lowerWhiskerX}
          y1={chart.lowerCapTop}
          y2={chart.lowerCapBottom}
        />
        <rect
          className="pristine-box-plot__hit-area"
          x={Math.min(chart.lowerWhiskerX, chart.q1X)}
          y={chart.lowerCapTop - 8}
          width={Math.abs(chart.q1X - chart.lowerWhiskerX) + 16}
          height={chart.lowerCapBottom - chart.lowerCapTop + 16}
        />
      </InteractivePart>

      <InteractivePart
        activePartKey={activePartKey}
        part={chart.upperWhiskerPart}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
      >
        <line
          className="pristine-box-plot__whisker"
          x1={chart.q3X}
          x2={chart.upperWhiskerX}
          y1={chart.plotCenter}
          y2={chart.plotCenter}
        />
        <line
          className="pristine-box-plot__whisker-cap"
          x1={chart.upperWhiskerX}
          x2={chart.upperWhiskerX}
          y1={chart.upperCapTop}
          y2={chart.upperCapBottom}
        />
        <rect
          className="pristine-box-plot__hit-area"
          x={Math.min(chart.q3X, chart.upperWhiskerX) - 8}
          y={chart.upperCapTop - 8}
          width={Math.abs(chart.upperWhiskerX - chart.q3X) + 16}
          height={chart.upperCapBottom - chart.upperCapTop + 16}
        />
      </InteractivePart>

      <InteractivePart
        activePartKey={activePartKey}
        part={chart.boxPart}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
      >
        <rect
          className="pristine-box-plot__box"
          x={Math.min(chart.q1X, chart.q3X)}
          y={chart.boxTop}
          width={Math.abs(chart.q3X - chart.q1X)}
          height={chart.boxHeight}
        />
        <rect
          className="pristine-box-plot__hit-area"
          x={Math.min(chart.q1X, chart.q3X) - 8}
          y={chart.boxTop - 8}
          width={Math.abs(chart.q3X - chart.q1X) + 16}
          height={chart.boxHeight + 16}
        />
      </InteractivePart>

      <InteractivePart
        activePartKey={activePartKey}
        part={chart.medianPart}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
      >
        <line
          className="pristine-box-plot__median"
          x1={chart.medianX}
          x2={chart.medianX}
          y1={chart.boxTop}
          y2={chart.boxTop + chart.boxHeight}
        />
        <rect
          className="pristine-box-plot__hit-area"
          x={chart.medianX - 8}
          y={chart.boxTop - 8}
          width={16}
          height={chart.boxHeight + 16}
        />
      </InteractivePart>

      {chart.outliers.map((outlier) => (
        <g
          className={getOutlierClassName(activePartKey, outlier)}
          key={outlier.key}
          role="img"
          aria-label={outlier.label}
          tabIndex={0}
          onBlur={onDeactivate}
          onClick={() => onActivate(outlier.key)}
          onFocus={() => onActivate(outlier.key)}
          onKeyDown={handleOutlierKeyDown(onDeactivate)}
          onMouseEnter={() => onActivate(outlier.key)}
          onMouseLeave={onDeactivate}
        >
          <circle
            className="pristine-box-plot__outlier-hit-area"
            cx={outlier.cx}
            cy={outlier.cy}
            r={10}
          />
          <circle
            className="pristine-box-plot__outlier-mark"
            cx={outlier.cx}
            cy={outlier.cy}
            r={4}
          />
        </g>
      ))}
    </>
  )
}
