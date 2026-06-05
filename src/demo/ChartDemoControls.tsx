import type {
  ChartDemoControl,
  ChartDemoState,
  EditableRow,
  EditableValue,
  RowControl,
  RowStateKey,
  ScalarStateKey,
  ScalarControl,
} from './ChartDemo.types'
import {
  allPass,
  always,
  cond,
  ifElse,
} from '@/shared/fp'

type ChartDemoControlsProps = {
  readonly controls: readonly ChartDemoControl[]
  readonly state: ChartDemoState
  readonly onChange: (state: ChartDemoState) => void
  readonly showRowActions: boolean
}

type DemoInputMode = 'decimal' | 'text'

const inputModeFor: (type: 'number' | 'text') => DemoInputMode = ifElse(
  (type: 'number' | 'text') => type === 'number',
  always('decimal'),
  always('text'),
)

const isNumberValue = (value: EditableValue) => typeof value === 'number'
const isNotANumber = (value: EditableValue) => Number.isNaN(value)
const isScalarControl = (control: ChartDemoControl): control is ScalarControl =>
  control.kind === 'scalar'
const isRowControl = (control: ChartDemoControl): control is RowControl =>
  control.kind === 'rows'
const hasVisibleRowLabel = (label: string) => label !== 'data'
const renderRowControlHeading = ifElse(
  hasVisibleRowLabel,
  (label: string) => <h3>{label}</h3>,
  always(null),
)

const stringifyInputValue = ifElse(
  allPass([isNumberValue, isNotANumber]),
  always(''),
  String,
)

function updateScalarStateValue(
  state: ChartDemoState,
  key: ScalarStateKey,
  value: EditableValue,
) {
  return {
    ...state,
    [key]: value,
  }
}

function updateRowStateValue(
  state: ChartDemoState,
  key: RowStateKey,
  value: readonly EditableRow[],
) {
  return {
    ...state,
    [key]: value,
  }
}

function renderScalarControl(
  control: ScalarControl,
  state: ChartDemoState,
  onChange: (state: ChartDemoState) => void,
) {
  const value = state[control.stateKey]

  return (
    <label className="chart-demo-control" key={control.stateKey}>
      <span>{control.label}</span>
      <input
        inputMode={inputModeFor(control.type)}
        onChange={(event) => {
          onChange(updateScalarStateValue(state, control.stateKey, event.target.value))
        }}
        type="text"
        value={stringifyInputValue(value)}
      />
    </label>
  )
}

function renderRowControl(
  control: RowControl,
  state: ChartDemoState,
  onChange: (state: ChartDemoState) => void,
  showRowActions: boolean,
) {
  const rows = state[control.stateKey]
  const showHeading = hasVisibleRowLabel(control.label)
  const showHeader = ifElse(
    always(showHeading),
    always(true),
    always(showRowActions),
  )(undefined)

  const updateRows = (nextRows: readonly EditableRow[]) => {
    onChange(updateRowStateValue(state, control.stateKey, nextRows))
  }

  const updateRow = (
    rowIndex: number,
    fieldKey: string,
    value: EditableValue,
  ) => rows.map((candidate, candidateIndex) => cond([
    [always(candidateIndex === rowIndex), always({ ...candidate, [fieldKey]: value })],
    [always(true), always(candidate)],
  ])(candidate))

  const renderAddRowAction = ifElse(
    always(showRowActions),
    () => (
      <button
        className="chart-demo-row-control__action"
        onClick={() => updateRows([...rows, control.createRow()])}
        type="button"
      >
        Add row
      </button>
    ),
    always(null),
  )

  const renderRowHeader = ifElse(
    always(showHeader),
    () => (
      <div className="chart-demo-row-control__header">
        {renderRowControlHeading(control.label)}
        {renderAddRowAction()}
      </div>
    ),
    always(null),
  )

  return (
    <section className="chart-demo-row-control" key={control.stateKey}>
      {renderRowHeader()}

      <div className="chart-demo-row-control__rows">
        {rows.map((row, rowIndex) => (
          <div className="chart-demo-row-control__row" key={rowIndex}>
            {control.fields.map((field) => (
              <label className="chart-demo-control" key={field.key}>
                <span>{field.label}</span>
                <input
                  inputMode={inputModeFor(field.type)}
                  onChange={(event) => {
                    updateRows(updateRow(rowIndex, field.key, event.target.value))
                  }}
                  type="text"
                  value={stringifyInputValue(row[field.key])}
                />
              </label>
            ))}
            <button
              aria-label={`Remove ${control.label} row ${rowIndex + 1}`}
              className="chart-demo-row-control__remove"
              onClick={() => updateRows(rows.filter((_, candidateIndex) => candidateIndex !== rowIndex))}
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ChartDemoControls({
  controls,
  state,
  onChange,
  showRowActions,
}: ChartDemoControlsProps) {
  return (
    <div className="chart-demo-controls">
      {controls
        .filter(isScalarControl)
        .map((control) => renderScalarControl(control, state, onChange))}
      {controls
        .filter(isRowControl)
        .map((control) => renderRowControl(control, state, onChange, showRowActions))}
    </div>
  )
}
