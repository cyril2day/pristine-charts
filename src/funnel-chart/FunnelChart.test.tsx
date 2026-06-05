import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchOption, matchResult } from '../shared'

import { FunnelChart } from './FunnelChart'
import { DEFAULT_FUNNEL_CHART_VIEW_PROPS } from './FunnelChart.defaults'
import { computeFunnelChart } from './FunnelChart.domain'

const funnelData = [
  { stage: 'Leads', value: 1000 },
  { stage: 'Qualified', value: 600 },
  { stage: 'Closed Won', value: 120 },
]

const renderFunnelChart = (data: Parameters<typeof FunnelChart>[0]['data']) =>
  render(<FunnelChart {...DEFAULT_FUNNEL_CHART_VIEW_PROPS} data={data} />)

describe('FunnelChart', () => {
  it('renders stages, values, and drop-off tooltips', () => {
    const { container } = renderFunnelChart(funnelData)

    expect(screen.getAllByLabelText('Funnel chart')[0]).toBeInTheDocument()
    expect(screen.getByText('Leads')).toBeInTheDocument()
    expect(screen.getByText('Qualified')).toBeInTheDocument()
    expect(screen.getByText('Closed Won')).toBeInTheDocument()
    expect(screen.getByText('1000')).toBeInTheDocument()
    expect(screen.getByLabelText('Qualified: 600, drop-off 400, conversion 60%')).toBeInTheDocument()

    fireEvent.focus(screen.getByLabelText('Qualified: 600, drop-off 400, conversion 60%'))

    expect(container.querySelector('.pristine-funnel-chart__tooltip-text')).toHaveTextContent(
      'Qualified: 600 | Drop-off 400 | 40% lost',
    )
  })

  it('renders typed chart errors for invalid input', () => {
    renderFunnelChart([{ stage: 'Only', value: 1 }])

    expect(screen.getByRole('alert')).toHaveTextContent(
      'A funnel chart needs at least two stages.',
    )
  })
})

describe('computeFunnelChart', () => {
  it('computes drop-off and conversion between stages', () => {
    const result = computeFunnelChart({ data: funnelData })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected computed funnel stages.'),
      ok: (stages) => {
        const qualified = stages[1]

        expect(matchOption(qualified.dropOff, { none: () => null, some: (value) => value })).toBe(400)
        expect(matchOption(qualified.dropOffRate, { none: () => null, some: (value) => value })).toBe(0.4)
        expect(matchOption(qualified.conversionRate, { none: () => null, some: (value) => value })).toBe(0.6)
      },
    })
  })

  it('rejects stage value increases', () => {
    const result = computeFunnelChart({
      data: [
        { stage: 'Leads', value: 100 },
        { stage: 'Qualified', value: 120 },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('MonotonicDecreaseViolation'),
      ok: () => expect.unreachable('Expected a funnel chart error.'),
    })
  })

  it('rejects duplicate stages and zero initial values', () => {
    const duplicateResult = computeFunnelChart({
      data: [
        { stage: 'Leads', value: 100 },
        { stage: 'Leads', value: 80 },
      ],
    })
    const zeroInitialResult = computeFunnelChart({
      data: [
        { stage: 'Leads', value: 0 },
        { stage: 'Qualified', value: 0 },
      ],
    })

    matchResult(duplicateResult, {
      error: (error) => expect(error.type).toBe('DuplicateStageName'),
      ok: () => expect.unreachable('Expected a duplicate stage error.'),
    })
    matchResult(zeroInitialResult, {
      error: (error) => expect(error.type).toBe('ZeroInitialValue'),
      ok: () => expect.unreachable('Expected a zero initial value error.'),
    })
  })
})
