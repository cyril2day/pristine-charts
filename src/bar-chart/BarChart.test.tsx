import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult } from '../shared'

import { BarChart } from './BarChart'
import { DEFAULT_BAR_CHART_VIEW_PROPS } from './BarChart.defaults'
import { computeBarChart } from './BarChart.domain'

const renderBarChart = (data: Parameters<typeof BarChart>[0]['data']) =>
  render(<BarChart {...DEFAULT_BAR_CHART_VIEW_PROPS} data={data} />)

describe('BarChart', () => {
  it('renders the chart labels and values', () => {
    const { container } = renderBarChart([{ category: 'Mon', value: 10 }, { category: 'Tue', value: -20 }])

    expect(screen.getAllByLabelText('Bar chart')[0]).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(container.querySelector('.pristine-bar-chart__value')).toBeNull()
    expect(screen.getByLabelText('Tue: -20').querySelector('.pristine-bar-chart__bar--negative')).toBeInTheDocument()

    fireEvent.focus(screen.getByLabelText('Tue: -20'))

    expect(container.querySelector('.pristine-bar-chart__tooltip-text')).toHaveTextContent('-20')
  })

  it('renders typed chart errors for invalid input', () => {
    renderBarChart([])

    expect(screen.getByRole('alert')).toHaveTextContent('A bar chart needs at least one category.')
  })
})

describe('computeBarChart', () => {
  it('orders categories by value', () => {
    const result = computeBarChart({
      data: [
        { category: 'Low', value: 2 },
        { category: 'High', value: 9 },
      ],
      orderStrategy: { kind: 'value', direction: 'descending' },
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected computed bars.'),
      ok: (bars) => expect(bars.map((bar) => bar.category)).toEqual(['High', 'Low']),
    })
  })

  it('rejects duplicate categories', () => {
    const result = computeBarChart({
      data: [
        { category: 'North', value: 2 },
        { category: 'North', value: 9 },
      ],
      orderStrategy: { kind: 'insertion' },
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('DuplicateCategory'),
      ok: () => expect.unreachable('Expected a bar chart error.'),
    })
  })

  it('rejects custom orders that omit categories', () => {
    const result = computeBarChart({
      data: [
        { category: 'North', value: 2 },
        { category: 'South', value: 9 },
      ],
      orderStrategy: { kind: 'custom', categories: ['South'] },
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('MissingCategoriesInCustomOrder'),
      ok: () => expect.unreachable('Expected a bar chart error.'),
    })
  })
})
