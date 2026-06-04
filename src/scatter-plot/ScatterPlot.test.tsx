import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult } from '../shared'

import { ScatterPlot } from './ScatterPlot'
import { DEFAULT_SCATTER_PLOT_VIEW_PROPS } from './ScatterPlot.defaults'
import { computeScatterPlot } from './ScatterPlot.domain'

const studyScoreData = [
  { x: 2, y: 55 },
  { x: 3, y: 60 },
  { x: 5, y: 72 },
  { x: 5, y: 68 },
  { x: 8, y: 85 },
  { x: 8, y: 91 },
]

const renderScatterPlot = (data: Parameters<typeof ScatterPlot>[0]['data']) =>
  render(<ScatterPlot {...DEFAULT_SCATTER_PLOT_VIEW_PROPS} data={data} />)

describe('ScatterPlot', () => {
  it('renders an accessible scatter plot with interactive dots', () => {
    const { container } = renderScatterPlot(studyScoreData)

    expect(screen.getAllByLabelText('Scatter plot')[0]).toBeInTheDocument()
    expect(container.querySelector('.pristine-scatter-plot__dot-mark')).toBeInTheDocument()
    expect(screen.getByLabelText('8: 91')).toBeInTheDocument()

    fireEvent.focus(screen.getByLabelText('8: 91'))

    expect(container.querySelector('.pristine-scatter-plot__tooltip-text')).toHaveTextContent(
      '8: 91',
    )
  })

  it('renders typed chart errors for invalid input', () => {
    renderScatterPlot([{ x: 1, y: 22 }])

    expect(screen.getByRole('alert')).toHaveTextContent(
      'A scatter plot needs at least two points.',
    )
  })
})

describe('computeScatterPlot', () => {
  it('accepts duplicate x values and preserves observation order', () => {
    const result = computeScatterPlot({
      data: [
        { x: 5, y: 72 },
        { x: 5, y: 68 },
        { x: 3, y: 60 },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected scatter plot dots.'),
      ok: (dots) => {
        expect(dots.map((dot) => dot.x)).toEqual([5, 5, 3])
        expect(dots.map((dot) => dot.index)).toEqual([0, 1, 2])
      },
    })
  })

  it('accepts duplicate coordinates as distinct observations', () => {
    const result = computeScatterPlot({
      data: [
        { x: 5, y: 72 },
        { x: 5, y: 72 },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected scatter plot dots.'),
      ok: (dots) => expect(dots).toHaveLength(2),
    })
  })

  it('rejects invalid x values', () => {
    const result = computeScatterPlot({
      data: [
        { x: 1, y: 10 },
        { x: Number.POSITIVE_INFINITY, y: 20 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidXValue'),
      ok: () => expect.unreachable('Expected a scatter plot error.'),
    })
  })

  it('rejects invalid y values', () => {
    const result = computeScatterPlot({
      data: [
        { x: 1, y: 10 },
        { x: 2, y: Number.NaN },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidYValue'),
      ok: () => expect.unreachable('Expected a scatter plot error.'),
    })
  })
})
