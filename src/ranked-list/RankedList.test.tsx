import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { matchResult, none, some } from '../shared'

import { RankedList } from './RankedList'
import { DEFAULT_RANKED_LIST_VIEW_PROPS } from './RankedList.defaults'
import { computeRankedList } from './RankedList.domain'
import type { RankedListProps } from './RankedList.types'

const leaderboardData = [
  { label: 'North', value: 340000, priorRank: some(3) },
  { label: 'East', value: 290000, priorRank: some(1) },
  { label: 'South', value: 210000, priorRank: some(3) },
  { label: 'West', value: 180000, priorRank: some(5) },
]

const renderRankedList = (props: Partial<RankedListProps> = {}) =>
  render(
    <RankedList
      {...DEFAULT_RANKED_LIST_VIEW_PROPS}
      data={leaderboardData}
      ariaLabel="Regional sales leaderboard"
      caption={some('Regional revenue ranked by current period sales.')}
      formatValue={(value: number) => `$${value.toLocaleString()}`}
      {...props}
    />,
  )

describe('RankedList', () => {
  it('renders ranks, labels, values, and rank changes', () => {
    const { container } = renderRankedList()

    const rankedList = within(container).getByLabelText('Regional sales leaderboard')
    const north = within(rankedList).getByLabelText(
      'Rank #1, North: $340,000. Rank improved by 2 positions.',
    )

    expect(within(north).getByText('#1')).toBeInTheDocument()
    expect(within(north).getByText('North')).toBeInTheDocument()
    expect(within(north).getByText('$340,000')).toBeInTheDocument()
    expect(within(north).getByText('Up')).toBeInTheDocument()
    expect(within(north).getByText('+2')).toBeInTheDocument()
    expect(
      within(container).getByText('Regional revenue ranked by current period sales.'),
    ).toBeInTheDocument()
  })

  it('can hide rank change labels while retaining ranked entries', () => {
    const { container } = renderRankedList({ showRankChanges: false })

    const rankedList = within(container).getByLabelText('Regional sales leaderboard')

    expect(within(rankedList).getByText('North')).toBeInTheDocument()
    expect(within(rankedList).queryByText('Up')).toBeNull()
  })

  it('renders a reusable typed error for invalid input', () => {
    renderRankedList({ data: [{ label: 'Only', value: 1, priorRank: none }] })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'A ranked list needs at least two items.',
    )
  })
})

describe('computeRankedList', () => {
  it('sorts entries by descending value and assigns standard competition ranks', () => {
    const result = computeRankedList({
      data: [
        { label: 'Fourth', value: 10, priorRank: none },
        { label: 'First', value: 40, priorRank: none },
        { label: 'Second A', value: 20, priorRank: none },
        { label: 'Second B', value: 20, priorRank: none },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected ranked entries.'),
      ok: (entries) => {
        expect(entries.map((entry) => entry.label)).toEqual([
          'First',
          'Second A',
          'Second B',
          'Fourth',
        ])
        expect(entries.map((entry) => entry.rank)).toEqual([1, 2, 2, 4])
      },
    })
  })

  it('computes positive rank change when an item improves', () => {
    const result = computeRankedList({
      data: [
        { label: 'North', value: 340000, priorRank: some(3) },
        { label: 'East', value: 290000, priorRank: some(1) },
      ],
    })

    expect(result.status).toBe('ok')
    matchResult(result, {
      error: () => expect.unreachable('Expected ranked entries.'),
      ok: (entries) => {
        expect(entries[0]?.rankChange).toEqual(some(2))
        expect(entries[1]?.rankChange).toEqual(some(-1))
      },
    })
  })

  it('rejects partial prior-rank input', () => {
    const result = computeRankedList({
      data: [
        { label: 'North', value: 340000, priorRank: some(3) },
        { label: 'East', value: 290000, priorRank: none },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InconsistentPriorRanks'),
      ok: () => expect.unreachable('Expected a ranked list error.'),
    })
  })

  it('rejects non-positive prior ranks', () => {
    const result = computeRankedList({
      data: [
        { label: 'North', value: 340000, priorRank: some(0) },
        { label: 'East', value: 290000, priorRank: some(1) },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('InvalidPriorRank'),
      ok: () => expect.unreachable('Expected a ranked list error.'),
    })
  })

  it('rejects duplicate labels after trimming whitespace', () => {
    const result = computeRankedList({
      data: [
        { label: 'North', value: 340000, priorRank: none },
        { label: ' North ', value: 290000, priorRank: none },
      ],
    })

    expect(result.status).toBe('error')
    matchResult(result, {
      error: (error) => expect(error.type).toBe('DuplicateLabel'),
      ok: () => expect.unreachable('Expected a ranked list error.'),
    })
  })
})
