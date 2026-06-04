import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'docs']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'ramda',
              message: 'Import Ramda helpers from src/shared/fp instead.',
            },
          ],
          patterns: [
            {
              group: ['ramda/*'],
              message: 'Import Ramda helpers from src/shared/fp instead.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSAsExpression',
          message:
            'Type assertions are not allowed. Use validated constructors or mapping at the boundary.',
        },
        {
          selector: 'TSTypeAssertion',
          message:
            'Type assertions are not allowed. Use validated constructors or mapping at the boundary.',
        },
        {
          selector: 'TSNonNullExpression',
          message:
            'Non-null assertion (!) is not allowed. Represent absence explicitly (Option/Maybe).',
        },
        {
          selector:
            "BinaryExpression[operator='=='][right.value=null], BinaryExpression[operator='==='][right.value=null], BinaryExpression[operator='!='][right.value=null], BinaryExpression[operator='!=='][right.value=null], BinaryExpression[operator='=='][left.value=null], BinaryExpression[operator='==='][left.value=null], BinaryExpression[operator='!='][left.value=null], BinaryExpression[operator='!=='][left.value=null]",
          message:
            'Direct null checks are not allowed. Use Option/Maybe or boundary validation instead.',
        },
        {
          selector: "BinaryExpression[right.value=''], BinaryExpression[left.value='']",
          message:
            'Direct empty-string comparison is not allowed. Use a named predicate (e.g. isNonEmptyString).',
        },
        {
          selector: "BinaryExpression > TemplateLiteral[value.raw='']",
          message: 'Empty template string comparison is not allowed.',
        },
        {
          selector: "LogicalExpression[operator='??']",
          message:
            'Nullish coalescing (??) is not allowed. Use explicit Option/Maybe handling.',
        },
        {
          selector: 'TSPropertySignature[optional=true]',
          message:
            'Optional fields are not allowed. Use Option/Maybe or domain-specific union types.',
        },
        {
          selector: 'PropertyDefinition[optional=true]',
          message: 'Optional class fields are not allowed. Use explicit Option/Maybe.',
        },
        {
          selector: 'TSOptionalType',
          message: 'Optional types are not allowed. Use Option/Maybe instead.',
        },
        {
          selector: 'TSImportType',
          message:
            'Inline import types are not allowed. Use top-level import type declarations instead.',
        },
        {
          selector: "LogicalExpression[operator='&&']",
          message: 'Logical AND (&&) is not allowed. Use Ramda allPass / both.',
        },
        {
          selector: "LogicalExpression[operator='||']",
          message: 'Logical OR (||) is not allowed. Use Ramda anyPass / either.',
        },
        {
          selector: 'ExportDefaultDeclaration > ObjectExpression[properties.length=0]',
          message:
            'Default-exporting an empty object (export default {}) is not allowed. Use named exports or export a meaningful value.',
        },
        {
          selector: "UnaryExpression[operator='!']",
          message:
            'Logical NOT (!) is not allowed. Use Ramda complement or named predicates.',
        },
        {
          selector: 'IfStatement',
          message:
            'Imperative if/else statements are not allowed. Use Ramda ifElse for two-way branching or when/unless for one-way branching.',
        },
        {
          selector: 'ConditionalExpression',
          message:
            'Ternaries are not allowed. Use Ramda ifElse for two-way branching or when/unless for one-way branching.',
        },
        {
          selector: 'SwitchStatement',
          message: 'Switch statements are not allowed. Use Ramda cond to manage multiple conditions.',
        },
        {
          selector: 'CallExpression[callee.name="pipe"] CallExpression[callee.name="pipe"]',
          message:
            'Nested pipes are not allowed. Compose multiple transformations into a single named function instead.',
        },
        {
          selector: 'CallExpression[callee.name="ifElse"] CallExpression[callee.name="ifElse"]',
          message:
            'Nested ifElse calls are not allowed. Use Ramda cond for multi-way branching instead.',
        },
        {
          selector: 'CallExpression[callee.name="bindResult"] CallExpression[callee.name="bindResult"]',
          message:
            'Nested bindResult calls are not allowed. Use flatter pipelines, sequenceResults, or a pipeWith runner instead.',
        },
        {
          selector: 'ThrowStatement',
          message:
            'Throw statements are not allowed. Use Result.failure to represent expected errors and handle them explicitly in workflows.',
        },
      ],
    },
  },
  {
    files: ['src/shared/fp.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
])
