# AI Agent Guide

## Project Snapshot

- `vue3-monaco-editor` is a Vue 3 component library wrapping Monaco Editor for SQL editing.
- Main package entry: `src/components/index.ts`.
- Main component: `src/components/monaco-editor.ts`.
- SQL completion engine: `src/components/snippets.ts`.
- Demo app: `src/App.vue` + `src/main.ts`, served by Vite.
- Docs site: `docs/`, served and built by VitePress.
- Package manager: pnpm. Node requirement in `package.json`: `>=18`.

## Start Here

Read these files before making changes:

1. `.agents/project-overview.md` for package purpose, directory map, and runtime shape.
2. `.agents/development.md` for exact commands and generated-output boundaries.
3. `.agents/architecture.md` for component flow, public API, and extension points.
4. `.agents/testing.md` for the current test gap and validation workflow.

## High-Value Paths

- `src/components/index.ts`: public exports, plugin install, exported TypeScript types.
- `src/components/monaco-editor.ts`: Vue component props, emits, watchers, lifecycle, Monaco setup.
- `src/components/snippets.ts`: SQL suggestion rules for keywords, databases, tables, fields, and aliases.
- `src/components/types.ts`: shared public/internal TypeScript data shapes.
- `src/components/monaco-editor.css`: packaged component CSS.
- `rollup.config.js`: actual library build used by `pnpm build`.
- `docs/guide/*.md` and `docs/zh-CN/guide/*.md`: user-facing docs that should stay in sync with API changes.

## Default Workflow For AI Agents

1. Read the relevant source, package scripts, docs, and nearby types before editing.
2. Keep changes small and local to the requested behavior.
3. Update public docs and declarations-related source when public API changes.
4. Add or propose focused regression tests for behavior changes. This repo currently has no test runner configured.
5. Run the narrowest useful validation first, then broader checks when risk is higher.
6. Never hand-edit generated output such as `dist/`, `types/`, or `docs/.vitepress/dist/`; regenerate it with the documented commands.

## Common Commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm check
pnpm lint
pnpm format:check
pnpm docs:dev
pnpm docs:build
pnpm docs:preview
```

There is no `pnpm test` script at the moment. See `.agents/testing.md`.

## Important Constraints

- `vue` and `monaco-editor` are peer dependencies and are externalized from the package build.
- `pnpm build` runs Rollup and deletes/recreates `dist/` and `types/`.
- Type declarations in `types/vue3-monaco-editor.d.ts` are generated package output, not the source of truth.
- `docs/.vitepress/dist/`, `dist/`, `types/`, `node_modules/`, `.pnpm-store/`, `temp/`, and VitePress cache directories are generated or dependency output.
- Formatting is Prettier with no semicolons and single quotes.
- Keep English and Chinese README/docs aligned when changing public API or usage examples.
