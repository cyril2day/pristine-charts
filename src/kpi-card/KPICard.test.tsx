import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult, some } from '../shared'

import { KPICard } from './KPICard'
import { DEFAULT_KPI_CARD_VIEW_PROPS } from './KPICard.defaults'
import { computeKPICard } from './KPICard.domain'
import type { KPICardProps } from './KPICard.types'

const renderKPICard = (props: Partial<KPICardProps> = {}) =>
  render(
    <KPICard
      {...DEFAULT_KPI_CARD_VIEW_PROPS}
      metricName="Monthly Revenue"
      currentValue={120}
      referenceValue={100}
      ariaLabel="Monthly revenue KPI card"
      comparisonLabel="vs last month"
      {...props}
    />,
  )

describe('KPICard', () => {
  it('renders an accessible KPI summary with current value and change labels', () => {
    renderKPICard()

    expect(screen.getByLabelText('Monthly revenue KPI card')).toBeInTheDocument()
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('Improved')).toBeInTheDocument()
    expect(screen.getByText('+20%')).toBeInTheDocument()
    expect(screen.getByText('(+20)')).toBeInTheDocument()
    expect(screen.getByText('vs last month')).toBeInTheDocument()
  })

  it('treats a decrease as improved when lower values are better', () => {
    renderKPICard({
      metricName: 'Complaint Volume',
      currentValue: 80,
      referenceValue: 100,
      polarity: some('LowerIsBetter'),
      ariaLabel: 'Complaint volume KPI card',
      comparisonLabel: 'vs last week',
    })

    const card = screen.getByLabelText('Complaint volume KPI card')

    expect(within(card).getByText('Complaint Volume')).toBeInTheDocument()
    expect(within(card).getByText('Improved')).toBeInTheDocument()
    expect(within(card).getByText('-20%')).toBeInTheDocument()
    expect(within(card).getByText('(-20)')).toBeInTheDocument()
  })

  it('renders a reusable typed KPI error when reference value is invalid', () => {
    renderKPICard({ referenceValue: 0 })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'KPI card reference value must be a non-zero finite number.',
    )
  })
})

describe('computeKPICard', () => {
  it('computes amount, percentage, and direction using higher-is-better by default', () => {
    const result = computeKPICard({
      metricName: 'Monthly Revenue',
      currentValue: 120,
      referenceValue: 100,
      polarity: DEFAULT_KPI_CARD_VIEW_PROPS.polarity,
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a KPI summary.'),
      ok: (summary) => {
        expect(summary.changeAmount).toBe(20)
        expect(summary.changePercentage).toBe(20)
        expect(summary.changeDirection).toBe('Improved')
      },
    })
  })

  it('derives declined direction from polarity instead of raw change sign alone', () => {
    const result = computeKPICard({
      metricName: 'Complaint Volume',
      currentValue: 120,
      referenceValue: 100,
      polarity: some('LowerIsBetter'),
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a KPI summary.'),
      ok: (summary) => expect(summary.changeDirection).toBe('Declined'),
    })
  })

  it('returns the metric-name error before numeric validation errors', () => {
    const result = computeKPICard({
      metricName: ' ',
      currentValue: Number.NaN,
      referenceValue: 0,
      polarity: DEFAULT_KPI_CARD_VIEW_PROPS.polarity,
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('EmptyMetricName'),
      ok: () => expect.unreachable('Expected a KPI card error.'),
    })
  })

  it('rejects zero reference values because percentage change is undefined', () => {
    const result = computeKPICard({
      metricName: 'Monthly Revenue',
      currentValue: 120,
      referenceValue: 0,
      polarity: DEFAULT_KPI_CARD_VIEW_PROPS.polarity,
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidReferenceValue'),
      ok: () => expect.unreachable('Expected a KPI card error.'),
    })
  })
})
