import { useMemo } from 'react'
import { max, scaleLinear } from 'd3'
import { map, pipe, prop } from 'ramda'

import type { BarChartDatum, BarChartProps } from './BarChart.types'

function getMaxValue(data: BarChartDatum[]) {
  return pipe(map(prop('value')) as (input: BarChartDatum[]) => number[], max)(data) ?? 0
}

export function BarChart({
  data,
  width = 320,
  height = 180,
  ariaLabel = 'Pristine chart',
}: BarChartProps) {
  const maxValue = getMaxValue(data)

  const bars = useMemo(() => {
    const xScale = scaleLinear().domain([0, data.length]).range([24, width - 24])
    const yScale = scaleLinear().domain([0, maxValue]).range([height - 40, 0])

    return data.map((point, index) => {
      const barHeight = height - 40 - yScale(point.value)
      const barWidth = Math.max(18, (width - 48) / Math.max(data.length, 1) - 12)

      return {
        ...point,
        barHeight,
        barWidth,
        x: xScale(index) - barWidth / 2,
        y: yScale(point.value),
      }
    })
  }, [data, height, maxValue, width])

  return (
    <figure
      aria-label={ariaLabel}
      style={{ display: 'grid', gap: '0.75rem' }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={ariaLabel}
        style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'linear-gradient(180deg, var(--color-surface-raised), var(--color-surface))' }}
      >
        <rect x="0" y="0" width={width} height={height} fill="transparent" />
        {bars.map((bar) => (
          <g key={bar.label}>
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.barWidth}
              height={bar.barHeight}
              rx="8"
              fill="var(--color-blue)"
            />
            <text x={bar.x + bar.barWidth / 2} y={height - 8} textAnchor="middle" style={{ fontSize: 'var(--text-xs)', fill: 'var(--text-secondary)' }}>
              {bar.label}
            </text>
            <text x={bar.x + bar.barWidth / 2} y={Math.max(18, bar.y - 6)} textAnchor="middle" style={{ fontSize: 'var(--text-xs)', fill: 'var(--text-primary)' }}>
              {bar.value}
            </text>
          </g>
        ))}
      </svg>
      <figcaption style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>D3 computes the scale while Ramda keeps the data flow readable.</figcaption>
    </figure>
  )
}
