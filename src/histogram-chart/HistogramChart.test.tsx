import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult } from '../shared'

import { computeHistogram } from './HistogramChart.domain'
import { HistogramChart } from './HistogramChart'
import { DEFAULT_HISTOGRAM_CHART_VIEW_PROPS } from './HistogramChart.defaults'

const examScores = [
  45, 52, 61, 61, 63, 67, 70, 71, 72, 74, 75, 76, 78, 80, 82, 85, 88, 91, 94, 99,
]

describe('HistogramChart', () => {
  it('renders bins from a manual threshold contract', () => {
    const { container } = render(
      <HistogramChart
        {...DEFAULT_HISTOGRAM_CHART_VIEW_PROPS}
        data={examScores}
        binStrategy={{ kind: 'manual', thresholds: [40, 50, 60, 70, 80, 90, 100] }}
      />,
    )

    expect(screen.getAllByLabelText('Histogram chart')[0]).toBeInTheDocument()
    expect(screen.getByLabelText('40-50: 1')).toBeInTheDocument()
    expect(screen.getByLabelText('90-100: 3')).toBeInTheDocument()
    expect(container.querySelector('.pristine-histogram-chart__count')).toBeNull()

    fireEvent.focus(screen.getByLabelText('90-100: 3'))

    expect(container.querySelector('.pristine-histogram-chart__tooltip-text')).toHaveTextContent('3')
  })

  it('renders a reusable typed chart error when the dataset is empty', () => {
    render(<HistogramChart {...DEFAULT_HISTOGRAM_CHART_VIEW_PROPS} data={[]} />)

    expect(screen.getByRole('alert')).toHaveTextContent('A histogram needs at least one numeric value.')
  })
})

describe('computeHistogram', () => {
  it('returns typed errors instead of throwing for invalid values', () => {
    const result = computeHistogram({
      data: [1, Number.NaN, 3],
      binStrategy: { kind: 'auto', binCount: 4 },
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('NonNumericValue'),
      ok: () => expect.unreachable('Expected a histogram error.'),
    })
  })

  it('rejects manual boundaries that do not cover the dataset', () => {
    const result = computeHistogram({
      data: [10, 20, 30],
      binStrategy: { kind: 'manual', thresholds: [15, 25] },
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('BoundariesOutsideDatasetRange'),
      ok: () => expect.unreachable('Expected a histogram error.'),
    })
  })

  it('widens a zero-width automatic domain into valid output bins', () => {
    const result = computeHistogram({
      data: [5, 5, 5],
      binStrategy: { kind: 'auto', binCount: 1 },
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected histogram bins.'),
      ok: (bins) => {
        expect(bins[0]?.lowerBound).toBeLessThan(5)
        expect(bins[0]?.upperBound).toBeGreaterThan(5)
      },
    })
  })
})
