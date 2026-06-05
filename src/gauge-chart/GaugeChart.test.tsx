import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult } from '../shared'

import { GaugeChart } from './GaugeChart'
import { DEFAULT_GAUGE_CHART_VIEW_PROPS } from './GaugeChart.defaults'
import { computeGaugeChart } from './GaugeChart.domain'
import { buildGaugeChartModel } from './GaugeChart.model'
import type { PerformanceZone } from './GaugeChart.types'

const zones: readonly PerformanceZone[] = [
  { label: 'Critical', lowerBound: 0, upperBound: 40 },
  { label: 'Watch', lowerBound: 40, upperBound: 70 },
  { label: 'Healthy', lowerBound: 70, upperBound: 100 },
]

const renderGaugeChart = (
  currentValue: number,
  performanceZones: readonly PerformanceZone[] = zones,
) =>
  render(
    <GaugeChart
      {...DEFAULT_GAUGE_CHART_VIEW_PROPS}
      currentValue={currentValue}
      minimum={0}
      maximum={100}
      zones={performanceZones}
    />,
  )

describe('GaugeChart', () => {
  it('renders an accessible meter with performance zones and active-zone context', () => {
    renderGaugeChart(72)

    const meter = screen.getByRole('meter', { name: 'Gauge chart' })

    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '100')
    expect(meter).toHaveAttribute('aria-valuenow', '72')
    expect(meter).toHaveAttribute('aria-valuetext', '72, Healthy')
    expect(screen.getByText('Critical')).toBeInTheDocument()
    expect(screen.getByText('Watch')).toBeInTheDocument()
    expect(screen.getAllByText('Healthy').length).toBeGreaterThan(0)
  })

  it('renders a reusable typed gauge chart error when zones are invalid', () => {
    renderGaugeChart(72, [])

    expect(screen.getByRole('alert')).toHaveTextContent(
      'A gauge chart needs at least one performance zone.',
    )
  })
})

describe('computeGaugeChart', () => {
  it('summarizes the active zone and normalized needle position', () => {
    const result = computeGaugeChart({
      currentValue: 72,
      minimum: 0,
      maximum: 100,
      zones,
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a gauge chart summary.'),
      ok: (summary) => {
        expect(summary.scaleRange).toEqual({ minimum: 0, maximum: 100 })
        expect(summary.activeZone.label).toBe('Healthy')
        expect(summary.needlePosition).toBe(0.72)
      },
    })
  })

  it('returns the scale-minimum error before validating the rest of the input', () => {
    const result = computeGaugeChart({
      currentValue: Number.NaN,
      minimum: Number.NaN,
      maximum: 100,
      zones: [],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidScaleMinimum'),
      ok: () => expect.unreachable('Expected a gauge chart error.'),
    })
  })

  it('rejects zones that do not exactly cover the scale', () => {
    const result = computeGaugeChart({
      currentValue: 72,
      minimum: 0,
      maximum: 100,
      zones: [
        { label: 'Low', lowerBound: 0, upperBound: 40 },
        { label: 'High', lowerBound: 50, upperBound: 100 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('ZonesDoNotCoverScale'),
      ok: () => expect.unreachable('Expected a gauge chart error.'),
    })
  })

  it('supports negative scale ranges', () => {
    const result = computeGaugeChart({
      currentValue: -4,
      minimum: -10,
      maximum: 10,
      zones: [
        { label: 'Cold', lowerBound: -10, upperBound: 0 },
        { label: 'Comfortable', lowerBound: 0, upperBound: 10 },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a gauge chart summary.'),
      ok: (summary) => {
        expect(summary.activeZone.label).toBe('Cold')
        expect(summary.needlePosition).toBe(0.3)
      },
    })
  })
})

describe('buildGaugeChartModel', () => {
  it('maps a normalized needle position to the gauge arc', () => {
    const result = computeGaugeChart({
      currentValue: 50,
      minimum: 0,
      maximum: 100,
      zones,
    })

    matchResult(result, {
      error: () => expect.unreachable('Expected a gauge chart summary.'),
      ok: (summary) => {
        const chart = buildGaugeChartModel(summary, 420, 260, String)

        expect(chart.centerX).toBe(210)
        expect(chart.centerY).toBe(206)
        expect(chart.needleAngle).toBe(0)
        expect(chart.ticks.map((tick) => tick.value)).toEqual([0, 50, 100])
        expect(chart.ticks[0].x).toBe(42)
        expect(chart.ticks[2].x).toBe(378)
      },
    })
  })
})
