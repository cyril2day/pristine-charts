import type { Option } from '../shared'

export type ChartErrorProps = {
  readonly title: string
  readonly message: string
  readonly details: Option<string>
  readonly className: string
  readonly role: 'alert' | 'status'
}

export type ChartErrorInputProps =
  ChartErrorProps
