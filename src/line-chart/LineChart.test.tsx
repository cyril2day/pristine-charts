import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult } from '../shared'

import { LineChart } from './LineChart'
import { DEFAULT_LINE_CHART_VIEW_PROPS } from './LineChart.defaults'
import { computeLineChart } from './LineChart.domain'

const weeklyTemperatureData = [
  { x: 1, y: 22 },
  { x: 2, y: 24 },
  { x: 3, y: 19 },
  { x: 4, y: 21 },
  { x: 5, y: 25 },
  { x: 6, y: 28 },
  { x: 7, y: 26 },
]

const renderLineChart = (data: Parameters<typeof LineChart>[0]['data']) =>
  render(<LineChart {...DEFAULT_LINE_CHART_VIEW_PROPS} data={data} />)

describe('LineChart', () => {
  it('renders an ordered line with interactive points', () => {
    const { container } = renderLineChart(weeklyTemperatureData)

    expect(screen.getAllByLabelText('Line chart')[0]).toBeInTheDocument()
    expect(container.querySelector('.pristine-line-chart__path')).toBeInTheDocument()
    expect(screen.getByLabelText('6: 28')).toBeInTheDocument()

    fireEvent.focus(screen.getByLabelText('6: 28'))

    expect(container.querySelector('.pristine-line-chart__tooltip-text')).toHaveTextContent('6: 28')
  })

  it('renders typed chart errors for invalid input', () => {
    renderLineChart([{ x: 1, y: 22 }])

    expect(screen.getByRole('alert')).toHaveTextContent('A line chart needs at least two points.')
  })
})

describe('computeLineChart', () => {
  it('sorts points by ascending x before computing segments', () => {
    const result = computeLineChart({
      data: [
        { x: 3, y: 30 },
        { x: 1, y: 10 },
        { x: 2, y: 20 },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected line segments.'),
      ok: (segments) => {
        expect(segments.map((segment) => segment.start.x)).toEqual([1, 2])
        expect(segments.map((segment) => segment.end.x)).toEqual([2, 3])
      },
    })
  })

  it('rejects duplicate x values', () => {
    const result = computeLineChart({
      data: [
        { x: 1, y: 10 },
        { x: 1, y: 20 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('DuplicateXValue'),
      ok: () => expect.unreachable('Expected a line chart error.'),
    })
  })

  it('rejects invalid y values', () => {
    const result = computeLineChart({
      data: [
        { x: 1, y: 10 },
        { x: 2, y: Number.NaN },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidYValue'),
      ok: () => expect.unreachable('Expected a line chart error.'),
    })
  })
})
