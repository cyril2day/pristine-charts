import { always, defaultTo, ifElse } from './fp'
import { fromNullable, matchOption } from './option'

const isNumber = (value: unknown) => typeof value === 'number'

export const withNumberDefault = (fallback: number) => (value: unknown) =>
  matchOption(fromNullable(value), {
    none: () => fallback,
    some: (resolvedValue) =>
      ifElse(
        isNumber,
        (numberValue: number) => defaultTo(fallback, numberValue),
        always(fallback),
      )(resolvedValue),
  })
