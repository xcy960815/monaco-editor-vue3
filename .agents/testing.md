# Testing

## Current State

This repository currently has no configured test runner and no test files were found. `package.json` does not define a `test` script.

Existing validation commands are:

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm build
pnpm docs:build
```

## What To Run Today

For source changes, run at least:

```sh
pnpm check
pnpm lint
```

For changes that affect package exports, build output, CSS extraction, or generated declarations, also run:

```sh
pnpm build
```

For docs changes, run:

```sh
pnpm docs:build
```

For docs-only changes where a full docs build is unnecessary, run:

```sh
pnpm format:check
```

## Manual Regression Areas

Use `pnpm dev` and the demo in `src/App.vue` to manually verify:

- editor mounts without console errors
- `v-model` updates when editing content
- `resetEditor()` clears the editor
- changing height and width relayouts Monaco
- changing `monacoEditorTheme` updates the theme
- default keyword suggestions still appear
- `customKeywords` appear in suggestions
- `from` and `join` contexts suggest databases
- `databaseName.` suggests tables
- `alias.` suggests fields when an alias can be inferred

## Adding Tests

Because no runner is installed, do not write test files that cannot be executed by existing scripts unless the task includes adding a test setup.

Recommended first test target:

- unit tests for `SqlSnippets` in `src/components/snippets.ts`, because most completion behavior is plain TypeScript logic around Monaco model inputs and metadata.

Useful regression cases:

- `getDatabaseOptionsSuggestions()` maps database metadata to database suggestions.
- `getTableOptionsSuggestByDatabaseName()` is case-insensitive and returns only tables for the selected database.
- `getFieldOptionsSuggestByTableName()` handles qualified names by using the last path segment.
- `getTableNameAndTableAlia()` extracts aliases from `from`, comma-separated table lists, and `join ... on`.
- `provideCompletionItems()` returns database, table, field, and keyword suggestions in the expected SQL contexts.

If adding a runner, update `package.json` scripts and this file in the same change. Keep the test command explicit, for example `pnpm test`, and document any browser or DOM requirements for Monaco-dependent tests.

## AI Agent Testing Workflow

1. Read the behavior and nearby docs before changing code.
2. Prefer focused tests around changed logic.
3. If no runnable test setup exists, document the gap in the final response and run the closest available validation.
4. For public behavior changes, manually exercise the Vite demo or add a test setup as part of the task.
5. Always run `pnpm check` and `pnpm lint` for TypeScript/Vue changes unless blocked by environment issues.
