import { always, ifElse, isNil } from './fp'

export type Some<TValue> = {
  readonly status: 'some'
  readonly value: TValue
}

export type None = {
  readonly status: 'none'
}

export type Option<TValue> = Some<TValue> | None

export type OptionMatcher<TValue, TOutput> = {
  readonly some: (value: TValue) => TOutput
  readonly none: () => TOutput
}

export const none: None = { status: 'none' }

export function some<TValue>(value: TValue): Some<TValue> {
  return { status: 'some', value }
}

export const isSome = <TValue>(option: Option<TValue>): option is Some<TValue> =>
  option.status === 'some'

export const isNone = <TValue>(option: Option<TValue>): option is None =>
  option.status === 'none'

export const fromNullable = <TValue>(value: TValue): Option<TValue> =>
  ifElse(
    isNil,
    always(none),
    some<TValue>,
  )(value)

export const getOrElse = <TValue>(fallback: TValue) => (option: Option<TValue>): TValue =>
  ifElse(
    isSome<TValue>,
    (someOption: Some<TValue>) => someOption.value,
    always(fallback),
  )(option)

export function matchOption<TValue, TOutput>(
  option: Option<TValue>,
  matcher: OptionMatcher<TValue, TOutput>,
) {
  return ifElse(
    isSome<TValue>,
    (someOption: Some<TValue>) => matcher.some(someOption.value),
    matcher.none,
  )(option)
}
