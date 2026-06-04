import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BarChart } from './BarChart'

describe('BarChart', () => {
  it('renders the chart labels and values', () => {
    render(<BarChart data={[{ label: 'Mon', value: 10 }, { label: 'Tue', value: 20 }]} />)

    expect(screen.getAllByLabelText('Pristine chart')[0]).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
  })
})
