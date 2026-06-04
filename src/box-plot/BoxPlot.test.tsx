import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult } from '../shared'

import { BoxPlot } from './BoxPlot'
import { computeBoxPlot } from './BoxPlot.domain'
import { DEFAULT_BOX_PLOT_VIEW_PROPS } from './BoxPlot.defaults'

const examScores = [
  12, 45, 52, 55, 61, 63, 67, 70, 71, 72, 74, 75, 76, 78, 80, 82, 85, 88, 91, 99,
]

describe('BoxPlot', () => {
  it('renders a five-number summary with an inspectable outlier', () => {
    const { container } = render(
      <BoxPlot
        {...DEFAULT_BOX_PLOT_VIEW_PROPS}
        data={examScores}
      />,
    )

    expect(screen.getAllByLabelText('Box plot')[0]).toBeInTheDocument()
    expect(screen.getByLabelText('Q1 62 to Q3 81')).toBeInTheDocument()
    expect(screen.getByLabelText('Median: 73')).toBeInTheDocument()
    expect(screen.getByLabelText('Lower whisker: 45')).toBeInTheDocument()
    expect(screen.getByLabelText('Upper whisker: 99')).toBeInTheDocument()
    expect(screen.getByLabelText('Outlier: 12')).toBeInTheDocument()

    fireEvent.focus(screen.getByLabelText('Outlier: 12'))

    expect(container.querySelector('.pristine-box-plot__tooltip-text')).toHaveTextContent(
      'Outlier: 12',
    )
  })

  it('renders a reusable typed chart error when the dataset is too small', () => {
    render(<BoxPlot {...DEFAULT_BOX_PLOT_VIEW_PROPS} data={[1, 2, 3, 4]} />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'A box plot needs at least five numeric values.',
    )
  })
})

describe('computeBoxPlot', () => {
  it('computes quartiles with the exclusive median-of-halves method', () => {
    const result = computeBoxPlot({ data: examScores })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a box plot summary.'),
      ok: (summary) => {
        expect(summary.q1).toBe(62)
        expect(summary.median).toBe(73)
        expect(summary.q3).toBe(81)
        expect(summary.lowerWhisker).toBe(45)
        expect(summary.upperWhisker).toBe(99)
        expect(summary.outliers).toEqual([12])
      },
    })
  })

  it('returns the non-numeric error before the count error', () => {
    const result = computeBoxPlot({ data: [1, Number.NaN, 3] })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('NonNumericValue'),
      ok: () => expect.unreachable('Expected a box plot error.'),
    })
  })

  it('accepts zero-spread datasets without inventing outliers', () => {
    const result = computeBoxPlot({ data: [5, 5, 5, 5, 5] })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected a box plot summary.'),
      ok: (summary) => {
        expect(summary.q1).toBe(5)
        expect(summary.median).toBe(5)
        expect(summary.q3).toBe(5)
        expect(summary.lowerWhisker).toBe(5)
        expect(summary.upperWhisker).toBe(5)
        expect(summary.outliers).toEqual([])
      },
    })
  })
})
