import type { Option, Result } from '../shared'

export type Category = string

export type Value = number

export type BarChartDatum = {
  readonly category: Category
  readonly value: Value
}

export type ValidatedBarChartDatum = BarChartDatum

export type ValidatedDataset = readonly ValidatedBarChartDatum[]

export type SortDirection = 'ascending' | 'descending'

export type ByInsertionOrderStrategy = {
  readonly kind: 'insertion'
}

export type AlphabeticalOrderStrategy = {
  readonly kind: 'alphabetical'
}

export type ByValueOrderStrategy = {
  readonly kind: 'value'
  readonly direction: SortDirection
}

export type CustomOrderStrategy = {
  readonly kind: 'custom'
  readonly categories: readonly Category[]
}

export type OrderStrategy =
  | ByInsertionOrderStrategy
  | AlphabeticalOrderStrategy
  | ByValueOrderStrategy
  | CustomOrderStrategy

export type BarDirection = 'positive' | 'negative' | 'zero'

export type Bar = BarChartDatum & {
  readonly direction: BarDirection
}

export type BarChartInput = {
  readonly data: readonly BarChartDatum[]
  readonly orderStrategy: OrderStrategy
}

export type BarChartErrorType =
  | 'EmptyDataset'
  | 'InvalidValue'
  | 'DuplicateCategory'
  | 'EmptyCategoryName'
  | 'MissingValueSortDirection'
  | 'MissingCategoriesInCustomOrder'

export type BarChartError = {
  readonly type: BarChartErrorType
  readonly message: string
  readonly details: Option<string>
}

export type BarChartResult = Result<readonly Bar[], BarChartError>

export type BarChartProps = {
  readonly data: readonly BarChartDatum[]
  readonly width: number
  readonly height: number
  readonly ariaLabel: string
  readonly className: string
  readonly caption: Option<string>
  readonly orderStrategy: OrderStrategy
  readonly showValues: boolean
  readonly formatValue: (value: number) => string
}
