import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult, none, some } from '../shared'

import { VarianceChart } from './VarianceChart'
import { DEFAULT_VARIANCE_CHART_VIEW_PROPS } from './VarianceChart.defaults'
import { VARIANCE_LOWER_IS_BETTER, computeVarianceChart } from './VarianceChart.domain'

const costVarianceData = [
  { category: 'Marketing', actualValue: 112_000, budgetValue: 100_000 },
  { category: 'Operations', actualValue: 92_000, budgetValue: 100_000 },
  { category: 'HR', actualValue: 50_000, budgetValue: 50_000 },
]

const renderVarianceChart = (
  data: Parameters<typeof VarianceChart>[0]['data'],
  props: Partial<Parameters<typeof VarianceChart>[0]> = {},
) =>
  render(
    <VarianceChart
      {...DEFAULT_VARIANCE_CHART_VIEW_PROPS}
      data={data}
      polarity={some(VARIANCE_LOWER_IS_BETTER)}
      {...props}
    />,
  )

describe('VarianceChart', () => {
  it('renders variance labels and favourability classes', () => {
    const { container } = renderVarianceChart(costVarianceData)

    expect(screen.getAllByLabelText('Variance chart')[0]).toBeInTheDocument()
    expect(screen.getByText('Marketing')).toBeInTheDocument()
    expect(screen.getByText('Operations')).toBeInTheDocument()
    expect(container.querySelector('.pristine-variance-chart__value')).toBeNull()
    expect(
      screen
        .getByLabelText('Marketing: +12000, actual 112000, budget 100000, Unfavourable')
        .querySelector('.pristine-variance-chart__bar--unfavourable'),
    ).toBeInTheDocument()
    expect(
      screen
        .getByLabelText('Operations: -8000, actual 92000, budget 100000, Favourable')
        .querySelector('.pristine-variance-chart__bar--favourable'),
    ).toBeInTheDocument()

    fireEvent.focus(
      screen.getByLabelText('Operations: -8000, actual 92000, budget 100000, Favourable'),
    )

    expect(container.querySelector('.pristine-variance-chart__tooltip-text')).toHaveTextContent(
      'Operations: -8000',
    )
  })

  it('renders typed chart errors for missing polarity', () => {
    renderVarianceChart(costVarianceData, { polarity: none })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Variance chart polarity must be explicitly provided.',
    )
  })
})

describe('computeVarianceChart', () => {
  it('computes variance, percentage, and lower-is-better favourability', () => {
    const result = computeVarianceChart({
      data: costVarianceData,
      polarity: some(VARIANCE_LOWER_IS_BETTER),
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected computed variance entries.'),
      ok: (entries) => {
        expect(entries[0]).toMatchObject({
          category: 'Marketing',
          variance: 12_000,
          variancePercentage: 12,
          favourability: 'Unfavourable',
        })
        expect(entries[1]).toMatchObject({
          category: 'Operations',
          variance: -8_000,
          variancePercentage: -8,
          favourability: 'Favourable',
        })
        expect(entries[2]).toMatchObject({
          category: 'HR',
          variance: 0,
          variancePercentage: 0,
          favourability: 'OnBudget',
        })
      },
    })
  })

  it('rejects zero budgets', () => {
    const result = computeVarianceChart({
      data: [{ category: 'Marketing', actualValue: 10, budgetValue: 0 }],
      polarity: some(VARIANCE_LOWER_IS_BETTER),
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidBudgetValue'),
      ok: () => expect.unreachable('Expected a variance chart error.'),
    })
  })

  it('rejects duplicate categories', () => {
    const result = computeVarianceChart({
      data: [
        { category: 'North', actualValue: 12, budgetValue: 10 },
        { category: 'North', actualValue: 8, budgetValue: 10 },
      ],
      polarity: some(VARIANCE_LOWER_IS_BETTER),
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('DuplicateCategory'),
      ok: () => expect.unreachable('Expected a variance chart error.'),
    })
  })
})
