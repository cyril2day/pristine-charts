import type { ReactNode } from 'react'

import type { Option } from '@/shared'

export type ChartDemoKey =
  | 'bar'
  | 'histogram'
  | 'boxPlot'
  | 'line'
  | 'area'
  | 'sparkline'
  | 'pieDonut'
  | 'funnel'
  | 'scatter'
  | 'variance'
  | 'progress'
  | 'bullet'
  | 'gauge'
  | 'rankedList'
  | 'kpi'

export type EditableValue = number | string

export type EditableRow = Record<string, EditableValue>

export type ChartDemoState = {
  readonly barData: readonly EditableRow[]
  readonly histogramData: readonly EditableRow[]
  readonly boxPlotData: readonly EditableRow[]
  readonly lineData: readonly EditableRow[]
  readonly areaData: readonly EditableRow[]
  readonly sparklineData: readonly EditableRow[]
  readonly pieDonutData: readonly EditableRow[]
  readonly funnelData: readonly EditableRow[]
  readonly scatterData: readonly EditableRow[]
  readonly varianceData: readonly EditableRow[]
  readonly progressCurrentValue: EditableValue
  readonly progressTotal: EditableValue
  readonly bulletCurrentValue: EditableValue
  readonly bulletTargetValue: EditableValue
  readonly bulletBands: readonly EditableRow[]
  readonly gaugeCurrentValue: EditableValue
  readonly gaugeMinimum: EditableValue
  readonly gaugeMaximum: EditableValue
  readonly gaugeZones: readonly EditableRow[]
  readonly rankedListData: readonly EditableRow[]
  readonly kpiMetricName: EditableValue
  readonly kpiCurrentValue: EditableValue
  readonly kpiReferenceValue: EditableValue
}

export type RowStateKey =
  | 'barData'
  | 'histogramData'
  | 'boxPlotData'
  | 'lineData'
  | 'areaData'
  | 'sparklineData'
  | 'pieDonutData'
  | 'funnelData'
  | 'scatterData'
  | 'varianceData'
  | 'bulletBands'
  | 'gaugeZones'
  | 'rankedListData'

export type ScalarStateKey =
  | 'progressCurrentValue'
  | 'progressTotal'
  | 'bulletCurrentValue'
  | 'bulletTargetValue'
  | 'gaugeCurrentValue'
  | 'gaugeMinimum'
  | 'gaugeMaximum'
  | 'kpiMetricName'
  | 'kpiCurrentValue'
  | 'kpiReferenceValue'

export type RowFieldType = 'text' | 'number'

export type RowField = {
  readonly key: string
  readonly label: string
  readonly type: RowFieldType
}

export type RowControl = {
  readonly kind: 'rows'
  readonly label: string
  readonly stateKey: RowStateKey
  readonly fields: readonly RowField[]
  readonly createRow: () => EditableRow
}

export type ScalarControl = {
  readonly kind: 'scalar'
  readonly label: string
  readonly stateKey: ScalarStateKey
  readonly type: RowFieldType
}

export type ChartDemoControl = RowControl | ScalarControl

export type ChartDemoDataShapeColumn = {
  readonly field: string
  readonly role: string
  readonly example: string
}

export type ChartDemoDataShape = {
  readonly summary: string
  readonly columns: readonly ChartDemoDataShapeColumn[]
  readonly note: Option<string>
}

export type ChartDemo = {
  readonly key: ChartDemoKey
  readonly title: string
  readonly dataShape: ChartDemoDataShape
  readonly details: readonly string[]
  readonly controls: readonly ChartDemoControl[]
  readonly renderCard: () => ReactNode
  readonly renderPlayground: (state: ChartDemoState) => ReactNode
}
