import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult } from '../shared'

import { Sparkline } from './Sparkline'
import { DEFAULT_SPARKLINE_VIEW_PROPS } from './Sparkline.defaults'
import { computeSparkline } from './Sparkline.domain'

const monthlyRevenueTrendData = [
  { x: 1, y: 92 },
  { x: 2, y: 95 },
  { x: 3, y: 91 },
  { x: 4, y: 104 },
  { x: 5, y: 110 },
  { x: 6, y: 108 },
]

const renderSparkline = (data: Parameters<typeof Sparkline>[0]['data']) =>
  render(<Sparkline {...DEFAULT_SPARKLINE_VIEW_PROPS} data={data} />)

describe('Sparkline', () => {
  it('renders a minimal accessible trend path', () => {
    const { container } = renderSparkline(monthlyRevenueTrendData)

    expect(screen.getAllByLabelText('Sparkline')[0]).toBeInTheDocument()
    expect(container.querySelector('.pristine-sparkline__path')).toBeInTheDocument()
    expect(container.querySelector('.pristine-sparkline__path')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it('renders typed chart errors for invalid input', () => {
    renderSparkline([{ x: 1, y: 92 }])

    expect(screen.getByRole('alert')).toHaveTextContent('A sparkline needs at least two points.')
  })
})

describe('computeSparkline', () => {
  it('sorts points by ascending x before computing trend segments', () => {
    const result = computeSparkline({
      data: [
        { x: 3, y: 30 },
        { x: 1, y: 10 },
        { x: 2, y: 20 },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected sparkline segments.'),
      ok: (segments) => {
        expect(segments.map((segment) => segment.start.x)).toEqual([1, 2])
        expect(segments.map((segment) => segment.end.x)).toEqual([2, 3])
      },
    })
  })

  it('rejects duplicate x values', () => {
    const result = computeSparkline({
      data: [
        { x: 1, y: 10 },
        { x: 1, y: 20 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('DuplicateXValue'),
      ok: () => expect.unreachable('Expected a sparkline error.'),
    })
  })

  it('rejects invalid x values', () => {
    const result = computeSparkline({
      data: [
        { x: Number.NaN, y: 10 },
        { x: 2, y: 20 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidXValue'),
      ok: () => expect.unreachable('Expected a sparkline error.'),
    })
  })
})
