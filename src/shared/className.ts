import { filter } from './fp'

const isPresentClassName = (value: string) => value.trim().length > 0

export const classNames = (values: readonly string[]) =>
  filter(isPresentClassName, [...values]).join(' ')
