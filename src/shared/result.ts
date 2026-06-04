import { ifElse } from './fp'

export type Ok<TValue> = {
  readonly status: 'ok'
  readonly value: TValue
}

export type Err<TError> = {
  readonly status: 'error'
  readonly error: TError
}

export type Result<TValue, TError> = Ok<TValue> | Err<TError>

export type ResultMatcher<TValue, TError, TOutput> = {
  readonly ok: (value: TValue) => TOutput
  readonly error: (error: TError) => TOutput
}

export function ok<TValue>(value: TValue): Ok<TValue> {
  return { status: 'ok', value }
}

export function err<TError>(error: TError): Err<TError> {
  return { status: 'error', error }
}

export const isOk = <TValue, TError>(
  result: Result<TValue, TError>,
): result is Ok<TValue> => result.status === 'ok'

export const andThenResult =
  <TValue, TNextValue, TError>(
    transform: (value: TValue) => Result<TNextValue, TError>,
  ) =>
  (result: Result<TValue, TError>): Result<TNextValue, TError> =>
    matchResult(result, {
      error: err<TError>,
      ok: transform,
    })

export const mapResult =
  <TValue, TNextValue, TError>(transform: (value: TValue) => TNextValue) =>
  (result: Result<TValue, TError>): Result<TNextValue, TError> =>
    andThenResult<TValue, TNextValue, TError>((value) => ok(transform(value)))(result)

export const bindResult =
  <TContext extends object, TValue, TNextContext extends object, TError>(
    transform: (context: TContext) => Result<TValue, TError>,
    merge: (context: TContext, value: TValue) => TNextContext,
  ) =>
  (result: Result<TContext, TError>): Result<TNextContext, TError> =>
    andThenResult<TContext, TNextContext, TError>(
      (context) =>
        mapResult<TValue, TNextContext, TError>((value) => merge(context, value))(
          transform(context),
        ),
    )(result)

export function matchResult<TValue, TError, TOutput>(
  result: Result<TValue, TError>,
  matcher: ResultMatcher<TValue, TError, TOutput>,
) {
  return ifElse(
    isOk<TValue, TError>,
    (okResult: Ok<TValue>) => matcher.ok(okResult.value),
    (errorResult: Err<TError>) => matcher.error(errorResult.error),
  )(result)
}
