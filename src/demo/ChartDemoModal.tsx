import { useEffect } from 'react'

import {
  matchOption,
  none,
  some,
} from '@/shared'
import type { Option } from '@/shared'
import {
  always,
  ifElse,
} from '@/shared/fp'

import type {
  ChartDemo,
  ChartDemoControl,
  ChartDemoDataShape,
  ChartDemoState,
  RowControl,
} from './ChartDemo.types'
import { ChartDemoControls } from './ChartDemoControls'

const isRowControl = (control: ChartDemoControl): control is RowControl =>
  control.kind === 'rows'

const toRowControlOption: (control: ChartDemoControl) => Option<RowControl> = ifElse(
  isRowControl,
  some,
  always(none),
)

function getPrimaryRowControl(controls: readonly ChartDemoControl[]): Option<RowControl> {
  return controls.reduce<Option<RowControl>>(
    (primaryRowControl, control) => matchOption(primaryRowControl, {
      some: () => primaryRowControl,
      none: () => toRowControlOption(control),
    }),
    none,
  )
}

function renderDataShape(dataShape: ChartDemoDataShape) {
  return (
    <div className="chart-demo-modal__data-shape">
      <p>{dataShape.summary}</p>
      <div className="chart-demo-modal__data-shape-table-wrap">
        <table className="chart-demo-modal__data-shape-table">
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Role</th>
              <th scope="col">Example</th>
            </tr>
          </thead>
          <tbody>
            {dataShape.columns.map((column) => (
              <tr key={column.field}>
                <td>{column.field}</td>
                <td>{column.role}</td>
                <td>{column.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {matchOption(dataShape.note, {
        some: (note) => <p className="chart-demo-modal__data-shape-note">{note}</p>,
        none: () => null,
      })}
    </div>
  )
}

type ChartDemoModalProps = {
  readonly demo: ChartDemo
  readonly state: ChartDemoState
  readonly onChange: (state: ChartDemoState) => void
  readonly onClose: () => void
}

export function ChartDemoModal({
  demo,
  state,
  onChange,
  onClose,
}: ChartDemoModalProps) {
  const primaryRowControl = getPrimaryRowControl(demo.controls)

  useEffect(() => {
    const closeOnEscape = ifElse(
      (event: KeyboardEvent) => event.key === 'Escape',
      () => onClose(),
      always(undefined),
    )

    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  const addRow = (control: RowControl) => {
    onChange({
      ...state,
      [control.stateKey]: [...state[control.stateKey], control.createRow()],
    })
  }

  return (
    <div
      aria-labelledby="chart-demo-modal-title"
      aria-modal="true"
      className="chart-demo-modal"
      role="dialog"
    >
      <button
        aria-label="Close chart demo"
        className="chart-demo-modal__backdrop"
        onClick={onClose}
        type="button"
      />

      <section className="chart-demo-modal__panel">
        <header className="chart-demo-modal__header">
          <div>
            <p className="chart-demo-modal__eyebrow">Interactive demo</p>
            <h2 id="chart-demo-modal-title">{demo.title}</h2>
          </div>
          <button
            className="chart-demo-modal__close"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </header>

        <div className="chart-demo-modal__content">
          <section className="chart-demo-modal__chart">
            {demo.renderPlayground(state)}
          </section>

          <div className="chart-demo-modal__reference">
            <section className="chart-demo-modal__summary">
              <h3>Expected data</h3>
              {renderDataShape(demo.dataShape)}
            </section>

            <section className="chart-demo-modal__summary">
              <h3>Contracts</h3>
              <ul>
                {demo.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="chart-demo-modal__data-editor">
            <div className="chart-demo-modal__data-editor-header">
              <h3>Data</h3>
              {matchOption(primaryRowControl, {
                some: (rowControl) => (
                  <button
                    className="chart-demo-row-control__action"
                    onClick={() => addRow(rowControl)}
                    type="button"
                  >
                    Add row
                  </button>
                ),
                none: always(null),
              })}
            </div>
            <ChartDemoControls
              controls={demo.controls}
              onChange={onChange}
              showRowActions={false}
              state={state}
            />
          </section>
        </div>
      </section>
    </div>
  )
}
