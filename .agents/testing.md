# Testing

## Current State

The repository uses [Vitest](https://vitest.dev/) as its test runner. `package.json` defines a `test` script:

```sh
pnpm test
```

Tests live in `tests/`. `tests/snippets.spec.ts` covers the SQL completion engine (`src/components/snippets.ts`) using pure stubs, so it runs in Node without a browser or a real Monaco build. The stubs live in `tests/stubs/` and are wired in through aliases in `vitest.config.ts`.

Existing validation commands are:

```sh
pnpm test
pnpm check
pnpm lint
pnpm format:check
pnpm build
pnpm docs:build
```

## What To Run Today

For source changes, run at least:

```sh
pnpm test
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

## Covered Behavior

`tests/snippets.spec.ts` keeps the following completion rules as regression tests:

- `from` / `join` contexts suggest databases.
- `databaseName.` suggests only the tables of that database, with comments.
- `alias.` suggests fields of the aliased table, including comment and type details.
- Table-name completion works without an alias (`tableName.`).
- `select` and similar clauses suggest all known fields.
- Custom keywords appear in default keyword suggestions.
- Table aliases do not leak across `;`-separated statements.
- Quoted (`` ` ``) and case-variant identifiers normalize correctly.

## Manual Regression Areas

Use `pnpm dev` and the demo in `src/App.vue` to manually verify what unit tests cannot cover:

- editor mounts without console errors
- `v-model` updates when editing content
- `resetEditor()` clears the editor
- changing height and width relayouts Monaco
- changing `monacoEditorTheme` updates the theme
- `editor-ready` / `focus` / `blur` / `cursor-change` / `selection-change` events fire
- `getEditor()` returns the live Monaco instance

## Adding Tests

Put new specs in `tests/*.spec.ts` so `vitest.config.ts` picks them up. Keep Monaco-dependent logic behind stubs in `tests/stubs/` when the logic under test is plain TypeScript. Component-level (DOM) tests are not set up yet; if they become necessary, add `@vue/test-utils` together with a `jsdom` or `happy-dom` environment in the same change.
