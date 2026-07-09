# vue3-monaco-editor

[中文文档](./README.zh-CN.md)

A lightweight Vue 3 wrapper for [Monaco Editor](https://microsoft.github.io/monaco-editor/), focused on SQL editing scenarios. It ships a typed component, `v-model` support, theme switching, layout controls, and completion data for SQL keywords, databases, tables, fields and custom keywords.

## Features

- Vue 3 component and plugin installation.
- `v-model` two-way binding for editor content.
- SQL language setup with keyword suggestions.
- Database, table and field completion through typed data.
- Custom keyword completion.
- Configurable width, height, theme and native Monaco options.
- ESM, UMD, minified UMD, CSS and TypeScript declaration output.
- Vite demo, Rollup build, ESLint, Prettier, Husky and VitePress docs.

## Install

```shell
pnpm add vue3-monaco-editor monaco-editor
```

`vue` and `monaco-editor` are peer dependencies. Make sure both are installed in your application.

## Quick Start

Register globally:

```ts
import { createApp } from 'vue'
import MonacoEditor from 'vue3-monaco-editor'
import 'vue3-monaco-editor/style.css'

import App from './App.vue'

createApp(App).use(MonacoEditor).mount('#app')
```

Or import the component directly:

```vue
<template>
  <MonacoEditor
    v-model="sql"
    :height="320"
    monaco-editor-theme="vs-dark"
    :database-options="databaseOptions"
    :custom-keywords="customKeywords"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MonacoEditor } from 'vue3-monaco-editor'
import type { DatabaseOption } from 'vue3-monaco-editor'
import 'vue3-monaco-editor/style.css'

const sql = ref(`select *
from databaseName1.tableName1 t
where t.id = "1001"`)

const customKeywords = ['warehouse', 'partition']

const databaseOptions: DatabaseOption[] = [
  {
    databaseName: 'databaseName1',
    tableOptions: [
      {
        tableName: 'tableName1',
        tableComment: 'Demo table',
        fieldOptions: [
          {
            fieldName: 'id',
            fieldType: 'string',
            fieldComment: 'Primary key',
            databaseName: 'databaseName1',
            tableName: 'tableName1',
          },
          {
            fieldName: 'created_at',
            fieldType: 'datetime',
            fieldComment: 'Creation time',
            databaseName: 'databaseName1',
            tableName: 'tableName1',
          },
        ],
      },
    ],
  },
]
</script>
```

## API

### Props

| Name                 | Type                                                 | Default | Description                                                                       |
| -------------------- | ---------------------------------------------------- | ------- | --------------------------------------------------------------------------------- |
| `modelValue`         | `string`                                             | `''`    | Editor content, used by `v-model`.                                                |
| `triggerCharacters`  | `string[]`                                           | `[]`    | Extra characters that trigger completion. Space and `.` are built in.             |
| `customKeywords`     | `string[]`                                           | `[]`    | Extra SQL keyword suggestions.                                                    |
| `databaseOptions`    | `DatabaseOption[]`                                   | `[]`    | Database, table and field metadata used for completion.                           |
| `width`              | `number`                                             | `0`     | Editor width in pixels. When `0`, the parent element width is used.               |
| `height`             | `number`                                             | `100`   | Editor height in pixels.                                                          |
| `monacoEditorOption` | `monaco.editor.IStandaloneEditorConstructionOptions` | `{}`    | Native Monaco editor options. Values here are merged over the component defaults. |
| `monacoEditorTheme`  | `'vs' \| 'vs-dark' \| 'hc-black'`                    | `'vs'`  | Monaco theme.                                                                     |

### Events

| Name                | Payload  | Description                              |
| ------------------- | -------- | ---------------------------------------- |
| `update:modelValue` | `string` | Emitted when the editor content changes. |

### Exposed Methods

Use a component ref to call these methods:

| Name          | Type         | Description                                                           |
| ------------- | ------------ | --------------------------------------------------------------------- |
| `initEditor`  | `() => void` | Initializes the Monaco instance. It is called automatically on mount. |
| `resetEditor` | `() => void` | Clears the editor content.                                            |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { MonacoEditor } from 'vue3-monaco-editor'
import type { MonacoEditorExpose } from 'vue3-monaco-editor'

const editorRef = ref<MonacoEditorExpose | null>(null)

const reset = () => {
  editorRef.value?.resetEditor()
}
</script>
```

## Completion Data

```ts
export type FieldOption = {
  fieldName: string
  fieldType: string
  fieldComment: string
  databaseName: string
  tableName: string
}

export type TableOption = {
  tableName: string
  tableComment: string
  fieldOptions: FieldOption[]
}

export type DatabaseOption = {
  databaseName: string
  tableOptions: TableOption[]
}
```

Completion behavior:

- Typing after `from` or `join` suggests database names.
- Typing `databaseName.` suggests tables under that database.
- Typing after `select`, `where`, `and`, `or`, `on`, `group by`, `order by` and similar SQL clauses suggests fields.
- Typing `alias.` suggests fields from the aliased table when the table can be inferred.
- Custom keywords are included in the default keyword suggestions.

## Monaco Options

`monacoEditorOption` accepts Monaco's native `IStandaloneEditorConstructionOptions`.

```vue
<MonacoEditor
  v-model="sql"
  :monaco-editor-option="{
    fontSize: 13,
    minimap: { enabled: true },
    wordWrap: 'on',
  }"
/>
```

The component provides default SQL-oriented options and merges your options on top.

## Styles

Import the packaged CSS once in your application:

```ts
import 'vue3-monaco-editor/style.css'
```

## Development

```shell
pnpm install
pnpm dev
```

Useful scripts:

| Script            | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `pnpm dev`        | Start the Vite demo.                                     |
| `pnpm build`      | Build ESM, UMD, minified UMD, CSS and declaration files. |
| `pnpm check`      | Run Vue and TypeScript checks.                           |
| `pnpm lint`       | Run ESLint.                                              |
| `pnpm lint:fix`   | Run ESLint with fixes.                                   |
| `pnpm format`     | Format files with Prettier.                              |
| `pnpm docs:dev`   | Start the VitePress docs site.                           |
| `pnpm docs:build` | Build the VitePress docs site.                           |

## Package Output

```text
dist/vue3-monaco-editor.es.js
dist/vue3-monaco-editor.umd.js
dist/vue3-monaco-editor.umd.min.js
dist/vue3-monaco-editor.css
types/vue3-monaco-editor.d.ts
```

## Notes

- This package does not bundle `vue` or `monaco-editor`; both are external peer dependencies.
- The package is designed for modern bundlers such as Vite, Rollup and Webpack.
- Monaco worker configuration may still depend on your host bundler setup.

## License

MIT
