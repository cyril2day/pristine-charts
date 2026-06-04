import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult, none, some } from '../shared'

import { PieDonutChart } from './PieDonutChart'
import { DEFAULT_PIE_DONUT_CHART_VIEW_PROPS } from './PieDonutChart.defaults'
import { computePieDonutChart } from './PieDonutChart.domain'

const budgetData = [
  { category: 'Engineering', value: 450000 },
  { category: 'Marketing', value: 200000 },
  { category: 'Operations', value: 150000 },
  { category: 'HR', value: 100000 },
  { category: 'Legal', value: 50000 },
]

const renderPieDonutChart = (props: Partial<Parameters<typeof PieDonutChart>[0]> = {}) =>
  render(
    <PieDonutChart
      {...DEFAULT_PIE_DONUT_CHART_VIEW_PROPS}
      data={budgetData}
      {...props}
    />,
  )

describe('PieDonutChart', () => {
  it('renders accessible slices with labels and tooltips', () => {
    const { container } = renderPieDonutChart({
      formatValue: (value) => `$${String(value)}`,
    })

    expect(screen.getAllByLabelText('Pie chart')[0]).toBeInTheDocument()
    expect(container.querySelectorAll('.pristine-pie-donut-chart__slice-path')).toHaveLength(5)
    expect(screen.getByLabelText('Engineering: $450000 (47.37%)')).toBeInTheDocument()

    fireEvent.focus(screen.getByLabelText('Engineering: $450000 (47.37%)'))

    expect(container.querySelector('.pristine-pie-donut-chart__tooltip-text')).toHaveTextContent(
      'Engineering: $450000 (47.37%)',
    )
  })

  it('renders typed chart errors for invalid input', () => {
    renderPieDonutChart({ data: [{ category: 'Only', value: 1 }] })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'A pie or donut chart needs at least two slices.',
    )
  })
})

describe('computePieDonutChart', () => {
  it('computes total, proportions, and ordered angles', () => {
    const result = computePieDonutChart({
      variant: none,
      data: [
        { category: 'A', value: 1 },
        { category: 'B', value: 3 },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a segmented whole.'),
      ok: (whole) => {
        expect(whole.total).toBe(4)
        expect(whole.variant.kind).toBe('pie')
        expect(whole.arcs[0].proportion).toBe(0.25)
        expect(whole.arcs[0].startAngle).toBe(0)
        expect(whole.arcs[0].endAngle).toBeCloseTo(Math.PI / 2)
        expect(whole.arcs[1].startAngle).toBeCloseTo(Math.PI / 2)
        expect(whole.arcs[1].endAngle).toBeCloseTo(Math.PI * 2)
      },
    })
  })

  it('preserves a valid donut variant', () => {
    const result = computePieDonutChart({
      variant: some({ kind: 'donut', innerRadius: 0.55 }),
      data: [
        { category: 'A', value: 1 },
        { category: 'B', value: 1 },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a segmented whole.'),
      ok: (whole) => expect(whole.variant).toEqual({ kind: 'donut', innerRadius: 0.55 }),
    })
  })

  it('rejects non-positive values', () => {
    const result = computePieDonutChart({
      variant: none,
      data: [
        { category: 'A', value: 1 },
        { category: 'B', value: 0 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('NonPositiveValue'),
      ok: () => expect.unreachable('Expected a pie or donut chart error.'),
    })
  })

  it('rejects duplicate categories', () => {
    const result = computePieDonutChart({
      variant: none,
      data: [
        { category: 'A', value: 1 },
        { category: 'A', value: 2 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('DuplicateCategory'),
      ok: () => expect.unreachable('Expected a pie or donut chart error.'),
    })
  })

  it('rejects empty category names', () => {
    const result = computePieDonutChart({
      variant: none,
      data: [
        { category: 'A', value: 1 },
        { category: ' ', value: 2 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('EmptyCategoryName'),
      ok: () => expect.unreachable('Expected a pie or donut chart error.'),
    })
  })

  it('rejects invalid donut inner radii', () => {
    const result = computePieDonutChart({
      variant: some({ kind: 'donut', innerRadius: 1 }),
      data: [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidInnerRadius'),
      ok: () => expect.unreachable('Expected a pie or donut chart error.'),
    })
  })
})
