import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult } from '../shared'

import { BulletChart } from './BulletChart'
import { DEFAULT_BULLET_CHART_VIEW_PROPS } from './BulletChart.defaults'
import { computeBulletChart } from './BulletChart.domain'
import { buildBulletChartModel } from './BulletChart.model'
import type { PerformanceBand } from './BulletChart.types'

const bands: readonly PerformanceBand[] = [
  { label: 'Poor', lowerBound: 0, upperBound: 60 },
  { label: 'Satisfactory', lowerBound: 60, upperBound: 80 },
  { label: 'Good', lowerBound: 80, upperBound: 120 },
]

const renderBulletChart = (
  currentValue: number,
  targetValue: number,
  performanceBands: readonly PerformanceBand[] = bands,
) =>
  render(
    <BulletChart
      {...DEFAULT_BULLET_CHART_VIEW_PROPS}
      currentValue={currentValue}
      targetValue={targetValue}
      bands={performanceBands}
    />,
  )

describe('BulletChart', () => {
  it('renders an accessible meter with performance bands and target context', () => {
    renderBulletChart(87, 100)

    const meter = screen.getByRole('meter', { name: 'Bullet chart' })

    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '120')
    expect(meter).toHaveAttribute('aria-valuenow', '87')
    expect(meter).toHaveAttribute('aria-valuetext', 'Current 87, Target 100, Good')
    expect(screen.getByText('Poor')).toBeInTheDocument()
    expect(screen.getByText('Satisfactory')).toBeInTheDocument()
    expect(screen.getByText('Good')).toBeInTheDocument()
  })

  it('renders a reusable typed bullet chart error when bands are invalid', () => {
    renderBulletChart(87, 100, [])

    expect(screen.getByRole('alert')).toHaveTextContent(
      'A bullet chart needs at least one performance band.',
    )
  })
})

describe('computeBulletChart', () => {
  it('summarizes the scale range and active band', () => {
    const result = computeBulletChart({ currentValue: 87, targetValue: 100, bands })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a bullet chart summary.'),
      ok: (summary) => {
        expect(summary.scaleRange).toEqual({ lowerBound: 0, upperBound: 120 })
        expect(summary.activeBand.label).toBe('Good')
      },
    })
  })

  it('returns the current-value error before validating bands', () => {
    const result = computeBulletChart({
      currentValue: Number.NaN,
      targetValue: 100,
      bands: [],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidCurrentValue'),
      ok: () => expect.unreachable('Expected a bullet chart error.'),
    })
  })

  it('rejects non-contiguous bands', () => {
    const result = computeBulletChart({
      currentValue: 70,
      targetValue: 90,
      bands: [
        { label: 'Poor', lowerBound: 0, upperBound: 50 },
        { label: 'Good', lowerBound: 60, upperBound: 100 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('NonContiguousBands'),
      ok: () => expect.unreachable('Expected a bullet chart error.'),
    })
  })

  it('supports negative scale ranges', () => {
    const result = computeBulletChart({
      currentValue: -4,
      targetValue: 2,
      bands: [
        { label: 'Cold', lowerBound: -10, upperBound: 0 },
        { label: 'Comfortable', lowerBound: 0, upperBound: 10 },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a bullet chart summary.'),
      ok: (summary) => expect(summary.activeBand.label).toBe('Cold'),
    })
  })
})

describe('buildBulletChartModel', () => {
  it('uses sparse anchored ticks so compact labels do not collide', () => {
    const result = computeBulletChart({ currentValue: 87, targetValue: 100, bands })

    matchResult(result, {
      error: () => expect.unreachable('Expected a bullet chart summary.'),
      ok: (summary) => {
        const chart = buildBulletChartModel(summary, 420, 150, String)

        expect(chart.plotWidth).toBe(340)
        expect(chart.ticks.map((tick) => tick.value)).toEqual([0, 60, 120])
        expect(chart.ticks.map((tick) => tick.textAnchor)).toEqual([
          'start',
          'middle',
          'end',
        ])
      },
    })
  })
})
