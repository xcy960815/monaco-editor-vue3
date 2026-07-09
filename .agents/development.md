# Development

## Environment

- Use pnpm.
- `package.json` declares Node `>=18`.
- The GitHub Pages workflow uses pnpm 10 and Node 24, but local development only needs to satisfy the package engine unless a task says otherwise.

## Install

```sh
pnpm install
```

## Local Demo

```sh
pnpm dev
```

This starts the Vite demo app from `index.html`, `src/main.ts`, and `src/App.vue`.

Related aliases in `package.json`:

```sh
pnpm serve
```

`serve` currently runs the same Vite dev server command as `dev`.

## Build

```sh
pnpm build
```

This runs `rollup -c`. `rollup.config.js`:

- uses `src/components/index.ts` as the library entry
- externalizes `vue`, `monaco-editor`, and the imported Monaco ESM modules
- emits ESM, UMD, minified UMD, CSS, and bundled declarations
- deletes and recreates `dist/` and `types/`
- writes temporary declarations under `dist/temp/` and removes them after declaration bundling

Do not manually edit `dist/` or `types/`.

## Type Check

```sh
pnpm check
```

This runs `vue-tsc --noEmit` using `tsconfig.json`.

## Lint

```sh
pnpm lint
pnpm lint:fix
```

ESLint uses `eslint.config.mjs`. Ignored paths include `dist/**`, `docs/.vitepress/dist/**`, `node_modules/**`, `types/**`, and `.husky/**`.

## Format

```sh
pnpm format
pnpm format:check
```

Prettier config:

- no semicolons
- single quotes

Ignored format paths include `dist`, `types`, `temp`, `node_modules`, `docs/.vitepress/dist`, and `.husky`.

## Documentation

```sh
pnpm docs:dev
pnpm docs:build
pnpm docs:preview
```

Docs are VitePress pages under `docs/`.

- English docs: `docs/index.md`, `docs/guide/*.md`
- Simplified Chinese docs: `docs/zh-CN/index.md`, `docs/zh-CN/guide/*.md`
- VitePress config: `docs/.vitepress/config.mts`

When public API or usage changes, update both README files and both docs locales when applicable.

## Preview

```sh
pnpm preview
```

This runs Vite preview for the demo app after a Vite build. The current package build script is Rollup, so use this only when you have produced a compatible Vite build or are intentionally checking Vite preview behavior.

## Hooks

`.husky/pre-commit` runs:

```sh
pnpm lint-staged
```

`lint-staged` fixes JS/TS/Vue files with ESLint and Prettier, and formats JSON/Markdown/CSS/Less/HTML/YAML files.

## Default Validation Choices

For docs-only changes:

```sh
pnpm format:check
```

For TypeScript or Vue source changes:

```sh
pnpm check
pnpm lint
```

For package API or build changes:

```sh
pnpm check
pnpm lint
pnpm build
```

For docs site changes:

```sh
pnpm docs:build
```
