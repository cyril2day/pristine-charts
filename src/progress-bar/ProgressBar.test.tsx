import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult } from '../shared'

import { ProgressBar } from './ProgressBar'
import { DEFAULT_PROGRESS_BAR_VIEW_PROPS } from './ProgressBar.defaults'
import { computeProgressBar } from './ProgressBar.domain'

const renderProgressBar = (currentValue: number, total: number) =>
  render(
    <ProgressBar
      {...DEFAULT_PROGRESS_BAR_VIEW_PROPS}
      currentValue={currentValue}
      total={total}
    />,
  )

describe('ProgressBar', () => {
  it('renders an accessible progress meter with value and percentage labels', () => {
    renderProgressBar(73, 100)

    const meter = screen.getByRole('progressbar', { name: 'Progress bar' })

    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '100')
    expect(meter).toHaveAttribute('aria-valuenow', '73')
    expect(meter).toHaveAttribute('aria-valuetext', '73 of 100 (73%)')
    expect(screen.getByText('73 of 100')).toBeInTheDocument()
    expect(screen.getByText('73%')).toBeInTheDocument()
  })

  it('renders a reusable typed progress error when total is invalid', () => {
    renderProgressBar(1, 0)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Progress bar total must be a positive finite number.',
    )
  })
})

describe('computeProgressBar', () => {
  it('computes the ratio from current value and total', () => {
    const result = computeProgressBar({ currentValue: 3, total: 5 })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a progress bar ratio.'),
      ok: (ratio) => expect(ratio).toBe(0.6),
    })
  })

  it('returns the current-value error before the total error', () => {
    const result = computeProgressBar({ currentValue: Number.NaN, total: 0 })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidCurrentValue'),
      ok: () => expect.unreachable('Expected a progress bar error.'),
    })
  })

  it('rejects current values greater than the total', () => {
    const result = computeProgressBar({ currentValue: 6, total: 5 })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('CurrentExceedsTotal'),
      ok: () => expect.unreachable('Expected a progress bar error.'),
    })
  })
})
