# Project Overview

## Purpose

`vue3-monaco-editor` is a lightweight Vue 3 library component for Monaco Editor, focused on SQL editing. It provides:

- a typed `MonacoEditor` Vue component
- plugin-style global registration
- `v-model` content binding
- theme, width, height, and native Monaco option props
- SQL completions for built-in keywords, custom keywords, databases, tables, fields, and inferred table aliases
- packaged ESM, UMD, minified UMD, CSS, and TypeScript declaration output

## Package Shape

The published package is defined by `package.json`:

- package name: `vue3-monaco-editor`
- main UMD file: `dist/vue3-monaco-editor.umd.js`
- ESM module: `dist/vue3-monaco-editor.es.js`
- package CSS: `dist/vue3-monaco-editor.css`
- types: `types/vue3-monaco-editor.d.ts`
- exported CSS entry: `vue3-monaco-editor/style.css`

`vue` and `monaco-editor` are peer dependencies. They should remain external in library builds.

## Main Directories And Files

- `src/components/`: library source.
- `src/components/index.ts`: public package entry; exports component, plugin default export, and public types.
- `src/components/monaco-editor.ts`: Vue component implementation and Monaco lifecycle.
- `src/components/snippets.ts`: SQL completion provider logic.
- `src/components/types.ts`: completion metadata, suggestion, theme, and helper types.
- `src/components/monaco-editor.css`: component CSS imported by the library entry.
- `src/App.vue` and `src/main.ts`: local Vite demo app.
- `docs/`: VitePress documentation in English and Simplified Chinese.
- `docs/.vitepress/config.mts`: VitePress site configuration and GitHub Pages base path.
- `rollup.config.js`: actual package build configuration used by `pnpm build`.
- `vite.config.mts`: Vite config for local demo and a library-build setup, but current `package.json` build script uses Rollup.
- `types/vue3-monaco-editor.d.ts`: generated declaration output.
- `dist/`: generated package output.

## Running Shape

There are three primary ways this repo runs:

- Demo development: `pnpm dev` starts the Vite app using `src/App.vue`.
- Library build: `pnpm build` runs Rollup from `src/components/index.ts` and emits `dist/` plus `types/`.
- Documentation: `pnpm docs:dev`, `pnpm docs:build`, and `pnpm docs:preview` operate on `docs/`.

## Generated Or Do-Not-Edit Paths

Do not manually edit these paths:

- `dist/`: generated package JavaScript and CSS.
- `types/`: generated package declaration output.
- `docs/.vitepress/dist/`: generated docs site.
- `docs/.vitepress/cache/`: VitePress cache.
- `node_modules/` and `.pnpm-store/`: dependency output.
- `temp/`: temporary output.
- `.husky/_/`: generated Husky helper files.

Source files for package behavior live under `src/components/`. Public documentation source lives under `README.md`, `README.zh-CN.md`, and `docs/`.
