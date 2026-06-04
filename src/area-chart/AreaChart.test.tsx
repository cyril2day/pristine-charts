import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult, none, some } from '../shared'

import { AreaChart } from './AreaChart'
import { DEFAULT_AREA_CHART_VIEW_PROPS } from './AreaChart.defaults'
import { computeAreaChart } from './AreaChart.domain'

const weeklyActiveUsersData = [
  { x: 1, y: 1200 },
  { x: 2, y: 1500 },
  { x: 3, y: 1350 },
  { x: 4, y: 1800 },
  { x: 5, y: 2100 },
  { x: 6, y: 1950 },
  { x: 7, y: 1600 },
]

const renderAreaChart = (props: Partial<Parameters<typeof AreaChart>[0]> = {}) =>
  render(
    <AreaChart
      {...DEFAULT_AREA_CHART_VIEW_PROPS}
      data={weeklyActiveUsersData}
      {...props}
    />,
  )

describe('AreaChart', () => {
  it('renders a filled region with interactive points', () => {
    const { container } = renderAreaChart()

    expect(screen.getAllByLabelText('Area chart')[0]).toBeInTheDocument()
    expect(container.querySelector('.pristine-area-chart__fill')).toBeInTheDocument()
    expect(container.querySelector('.pristine-area-chart__line')).toBeInTheDocument()
    expect(screen.getByLabelText('5: 2100')).toBeInTheDocument()

    fireEvent.focus(screen.getByLabelText('5: 2100'))

    expect(container.querySelector('.pristine-area-chart__tooltip-text')).toHaveTextContent(
      '5: 2100',
    )
  })

  it('renders typed chart errors for invalid input', () => {
    renderAreaChart({ data: [{ x: 1, y: 1200 }] })

    expect(screen.getByRole('alert')).toHaveTextContent('An area chart needs at least two points.')
  })
})

describe('computeAreaChart', () => {
  it('sorts points by ascending x before computing the filled region', () => {
    const result = computeAreaChart({
      baseline: none,
      data: [
        { x: 3, y: 30 },
        { x: 1, y: 10 },
        { x: 2, y: 20 },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a filled region.'),
      ok: (region) => {
        expect(region.points.map((point) => point.x)).toEqual([1, 2, 3])
        expect(region.leftClosingEdge.end).toEqual({ x: 1, y: 0 })
        expect(region.rightClosingEdge.end).toEqual({ x: 3, y: 0 })
      },
    })
  })

  it('rejects duplicate x values', () => {
    const result = computeAreaChart({
      baseline: none,
      data: [
        { x: 1, y: 10 },
        { x: 1, y: 20 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('DuplicateXValue'),
      ok: () => expect.unreachable('Expected an area chart error.'),
    })
  })

  it('rejects invalid y values', () => {
    const result = computeAreaChart({
      baseline: none,
      data: [
        { x: 1, y: 10 },
        { x: 2, y: Number.NaN },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidYValue'),
      ok: () => expect.unreachable('Expected an area chart error.'),
    })
  })

  it('rejects invalid baselines', () => {
    const result = computeAreaChart({
      baseline: some(Number.NaN),
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidBaseline'),
      ok: () => expect.unreachable('Expected an area chart error.'),
    })
  })

  it('rejects a baseline above the minimum y value', () => {
    const result = computeAreaChart({
      baseline: none,
      data: [
        { x: 1, y: -4 },
        { x: 2, y: 3 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('BaselineExceedsData'),
      ok: () => expect.unreachable('Expected an area chart error.'),
    })
  })

  it('accepts negative data when the baseline is below the dataset minimum', () => {
    const result = computeAreaChart({
      baseline: some(-5),
      data: [
        { x: 1, y: -4 },
        { x: 2, y: 3 },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a filled region.'),
      ok: (region) => expect(region.baseline).toBe(-5),
    })
  })
})
