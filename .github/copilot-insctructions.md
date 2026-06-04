# Copilot Instructions

## Purpose

Generate TypeScript code that follows a functional, explicit, and boundary-validated style. Prefer total functions, named predicates, explicit absence handling, and composable workflows over assertions, implicit branching, or unchecked values.

These instructions are mandatory for all generated, edited, or reviewed TypeScript code in this project.

## Core Principles

1. **No unchecked type narrowing**
   - Do not use type assertions.
   - Do not use non-null assertions.
   - Validate data at boundaries and convert it into domain-safe values.

2. **Represent absence explicitly**
   - Do not use `null`, direct null checks, optional properties, or nullish coalescing.
   - Use `Option`, `Maybe`, or domain-specific union types.

3. **Use named predicates**
   - Do not compare directly against empty strings.
   - Create predicates such as `isNonEmptyString`, `hasItems`, or domain-specific validators.

4. **Prefer functional composition**
   - Use Ramda-style combinators such as `pipe`, `both`, `either`, `allPass`, `anyPass`, `ifElse`, `when`, `unless`, and `cond`.
   - Keep pipelines flat and readable.

5. **Avoid imperative control flow**
   - Do not use `if`, `else`, ternaries, or `switch`.
   - Use functional branching helpers.

6. **Make errors explicit**
   - Do not throw expected errors.
   - Return `Result.failure` or another explicit error representation.

7. **Keep modules meaningful**
   - Do not default-export an empty object.
   - Prefer named exports or meaningful default exports.

---

## Prohibited Syntax

### Type assertions

Do not generate:

```ts
const user = value as User;
const user = <User>value;
```

Generate boundary validation or mapping instead:

```ts
const parseUser = (value: unknown): Result<User, ParseError> =>
  pipe(
    validateUserShape,
    mapToUser
  )(value);
```

### Non-null assertions

Do not generate:

```ts
const name = user.name!;
```

Generate explicit absence handling instead:

```ts
const getName = (user: User): Option<NonEmptyString> => user.name;
```

### Direct null checks

Do not generate:

```ts
value === null;
value !== null;
null === value;
null !== value;
```

Generate explicit `Option` / `Maybe` handling instead:

```ts
const label = pipe(
  maybeLabel,
  Option.map(formatLabel),
  Option.getOrElse(() => fallbackLabel)
);
```

### Empty string comparisons

Do not generate:

```ts
name === '';
name !== '';
```

Generate named predicates instead:

```ts
const isNonEmptyString = (value: string): boolean => value.length > 0;
```

### Nullish coalescing

Do not generate:

```ts
const displayName = user.name ?? fallbackName;
```

Generate explicit `Option` handling instead:

```ts
const displayName = pipe(
  user.name,
  Option.getOrElse(() => fallbackName)
);
```

### Optional fields

Do not generate:

```ts
type User = {
  name?: string;
};
```

Generate explicit absence instead:

```ts
type User = {
  name: Option<NonEmptyString>;
};
```

### Inline import types

Do not generate:

```ts
type User = import('./user').User;
```

Generate top-level type imports instead:

```ts
import type { User } from './user';
```

### Composite boolean expressions

Do not generate:

```ts
const isValid = isActive(user) && hasEmail(user);
const canProceed = isAdmin(user) || isOwner(user);
```

Generate predicate combinators instead:

```ts
const isValid = both(isActive, hasEmail);
const canProceed = either(isAdmin, isOwner);
```

For more than two predicates, use `allPass` or `anyPass`:

```ts
const canSubmit = allPass([
  hasAcceptedTerms,
  hasValidEmail,
  hasCompletedProfile,
]);
```

### Logical NOT

Do not generate:

```ts
const inactive = !isActive(user);
```

Generate named predicates or `complement` instead:

```ts
const isInactive = complement(isActive);
```

### Imperative branching

Do not generate:

```ts
if (isAdmin(user)) {
  return adminRoute;
}

return userRoute;
```

Generate functional branching instead:

```ts
const routeForUser = ifElse(
  isAdmin,
  always(adminRoute),
  always(userRoute)
);
```

Do not generate ternaries:

```ts
const label = isActive(user) ? 'Active' : 'Inactive';
```

Generate:

```ts
const labelForUser = ifElse(
  isActive,
  always('Active'),
  always('Inactive')
);
```

Do not generate switch statements:

```ts
switch (status) {
  case 'draft':
    return draftLabel;
  case 'published':
    return publishedLabel;
  default:
    return archivedLabel;
}
```

Generate `cond` instead:

```ts
const labelForStatus = cond([
  [equals('draft'), always(draftLabel)],
  [equals('published'), always(publishedLabel)],
  [T, always(archivedLabel)],
]);
```

### Nested pipes

Do not generate nested `pipe` calls:

```ts
const transform = pipe(
  normalize,
  pipe(trimName, mapName),
  save
);
```

Generate named transformations instead:

```ts
const normalizeName = pipe(
  trimName,
  mapName
);

const transform = pipe(
  normalize,
  normalizeName,
  save
);
```

### Nested `ifElse`

Do not generate nested `ifElse` calls:

```ts
const resolveState = ifElse(
  isDraft,
  always(draftState),
  ifElse(isPublished, always(publishedState), always(archivedState))
);
```

Generate `cond` instead:

```ts
const resolveState = cond([
  [isDraft, always(draftState)],
  [isPublished, always(publishedState)],
  [T, always(archivedState)],
]);
```

### Nested `bindResult`

Do not generate nested `bindResult` calls:

```ts
const workflow = bindResult(stepOne, value =>
  bindResult(stepTwo(value), next =>
    stepThree(next)
  )
);
```

Generate flatter workflows instead:

```ts
const workflow = pipeWithResult([
  stepOne,
  stepTwo,
  stepThree,
]);
```

Or use sequencing helpers:

```ts
const workflow = sequenceResults([
  stepOne,
  stepTwo,
  stepThree,
]);
```

### Throw statements

Do not generate:

```ts
throw new Error('Invalid user');
```

Generate explicit failures instead:

```ts
const invalidUser = Result.failure({
  type: 'InvalidUser',
  message: 'Invalid user',
});
```

---

## Required Modeling Style

### Prefer domain types

Use branded or validated domain types where possible:

```ts
type NonEmptyString = string & { readonly brand: unique symbol };
```

Construct them through validators only:

```ts
const makeNonEmptyString = (value: string): Result<NonEmptyString, ValidationError> =>
  pipe(
    value,
    validateNonEmptyString,
    Result.map(toNonEmptyString)
  );
```

Do not bypass constructors with assertions.

### Prefer boundary mappers

External data must be treated as unknown until validated:

```ts
const decodeUserDto = (value: unknown): Result<UserDto, DecodeError> =>
  pipe(
    validateUserDtoShape,
    Result.map(mapToUserDto)
  )(value);
```

### Prefer explicit workflow results

Expected failures should travel through `Result`:

```ts
type Result<TValue, TError> =
  | { readonly type: 'success'; readonly value: TValue }
  | { readonly type: 'failure'; readonly error: TError };
```

### Prefer explicit absence

Absence should travel through `Option` / `Maybe`:

```ts
type Option<TValue> =
  | { readonly type: 'some'; readonly value: TValue }
  | { readonly type: 'none' };
```

---

## Code Generation Checklist

Before returning TypeScript code, verify that it does not include:

- `as` type assertions
- angle-bracket type assertions
- non-null assertions using `!`
- direct `null` comparisons
- direct empty-string comparisons
- `??`
- optional properties using `?`
- inline `import()` types
- `&&`
- `||`
- logical NOT using `!`
- `if` / `else`
- ternary expressions
- `switch`
- nested `pipe`
- nested `ifElse`
- nested `bindResult`
- `throw`
- `export default {}`

If a requested implementation appears to require one of these constructs, redesign the implementation using explicit domain modeling, named predicates, `Option`, `Result`, and Ramda-style composition.

---

## Preferred Alternatives Summary

| Avoid | Prefer |
| --- | --- |
| `value as Type` | boundary validator or constructor |
| `value!` | `Option` / `Maybe` |
| `value === null` | explicit absence handling |
| `value === ''` | named predicate |
| `??` | `Option.getOrElse` or equivalent |
| optional fields | `Option<T>` or domain union |
| `&&` | `both` / `allPass` |
| `||` | `either` / `anyPass` |
| `!predicate(value)` | `complement(predicate)` |
| `if` / ternary | `ifElse`, `when`, `unless` |
| `switch` | `cond` |
| nested `pipe` | named intermediate pipeline |
| nested `ifElse` | `cond` |
| nested `bindResult` | flat pipeline, `sequenceResults`, or runner |
| `throw` | `Result.failure` |
| `export default {}` | named exports or meaningful export |

---

## Review Behavior

When reviewing code:

1. Identify every restricted syntax violation.
2. Explain why the construct is prohibited.
3. Replace it with an approved pattern.
4. Prefer small, named functions over clever inline expressions.
5. Preserve the original business behavior while making absence, validation, branching, and failure explicit.

## Default Response Style

When generating or modifying code:

- Use clear names.
- Keep functions small and composable.
- Prefer immutable data.
- Place validation at system boundaries.
- Avoid hidden runtime assumptions.
- Make illegal states unrepresentable where practical.
