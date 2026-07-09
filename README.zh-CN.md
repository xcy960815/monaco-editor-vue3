# vue3-monaco-editor

[English](./README.md)

[在线文档](https://xcy960815.github.io/monaco-editor-vue3/zh-CN/) · [在线演示](https://xcy960815.github.io/monaco-editor-vue3/zh-CN/guide/demo)

一个面向 SQL 编辑场景的轻量 Vue 3 Monaco Editor 组件库。它提供类型完善的组件导出、`v-model` 双向绑定、主题切换、尺寸控制，以及 SQL 关键字、库、表、字段和自定义关键字补全。

## 特性

- 支持 Vue 3 组件直接引入和插件注册。
- 支持编辑器内容 `v-model` 双向绑定。
- 内置 SQL 语言和关键字补全。
- 支持通过类型化数据提供库、表、字段补全。
- 支持自定义关键字补全。
- 支持配置宽度、高度、主题和 Monaco 原生配置。
- 输出 ESM、UMD、压缩 UMD、CSS 和 TypeScript 声明文件。
- 项目内置 Vite 示例、Rollup 构建、ESLint、Prettier、Husky 和 VitePress 文档。

## 安装

```shell
pnpm add vue3-monaco-editor monaco-editor
```

`vue` 和 `monaco-editor` 是 peer dependencies，需要在业务项目里安装。

## 快速开始

全局注册：

```ts
import { createApp } from 'vue'
import MonacoEditor from 'vue3-monaco-editor'
import 'vue3-monaco-editor/style.css'

import App from './App.vue'

createApp(App).use(MonacoEditor).mount('#app')
```

也可以直接引入组件：

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
        tableComment: '示例表',
        fieldOptions: [
          {
            fieldName: 'id',
            fieldType: 'string',
            fieldComment: '主键',
            databaseName: 'databaseName1',
            tableName: 'tableName1',
          },
          {
            fieldName: 'created_at',
            fieldType: 'datetime',
            fieldComment: '创建时间',
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

| 名称                 | 类型                                                 | 默认值 | 说明                                            |
| -------------------- | ---------------------------------------------------- | ------ | ----------------------------------------------- |
| `modelValue`         | `string`                                             | `''`   | 编辑器内容，用于 `v-model`。                    |
| `triggerCharacters`  | `string[]`                                           | `[]`   | 额外触发补全的字符。空格和 `.` 已内置。         |
| `customKeywords`     | `string[]`                                           | `[]`   | 自定义 SQL 关键字补全。                         |
| `databaseOptions`    | `DatabaseOption[]`                                   | `[]`   | 用于补全的库、表、字段元数据。                  |
| `width`              | `number`                                             | `0`    | 编辑器宽度，单位 px。为 `0` 时使用父元素宽度。  |
| `height`             | `number`                                             | `100`  | 编辑器高度，单位 px。                           |
| `monacoEditorOption` | `monaco.editor.IStandaloneEditorConstructionOptions` | `{}`   | Monaco 原生配置，会覆盖组件默认配置中的同名项。 |
| `monacoEditorTheme`  | `'vs' \| 'vs-dark' \| 'hc-black'`                    | `'vs'` | Monaco 主题。                                   |

### 事件

| 名称                | 参数     | 说明                   |
| ------------------- | -------- | ---------------------- |
| `update:modelValue` | `string` | 编辑器内容变化时触发。 |

### 暴露方法

可以通过组件 ref 调用：

| 名称          | 类型         | 说明                                       |
| ------------- | ------------ | ------------------------------------------ |
| `initEditor`  | `() => void` | 初始化 Monaco 实例。组件挂载时会自动调用。 |
| `resetEditor` | `() => void` | 清空编辑器内容。                           |

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

## 补全数据结构

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

补全规则：

- 在 `from` 或 `join` 后输入时，提示数据库名称。
- 输入 `databaseName.` 时，提示该数据库下的表。
- 在 `select`、`where`、`and`、`or`、`on`、`group by`、`order by` 等 SQL 片段后输入时，提示字段。
- 输入 `alias.` 时，如果能推断出表别名，会提示对应表字段。
- 自定义关键字会合并到默认关键字提示里。

## Monaco 原生配置

`monacoEditorOption` 接收 Monaco 原生的 `IStandaloneEditorConstructionOptions`。

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

组件会提供一组偏 SQL 编辑体验的默认配置，再把你的配置合并覆盖上去。

## 样式

在应用中引入一次打包样式：

```ts
import 'vue3-monaco-editor/style.css'
```

## 本地开发

```shell
pnpm install
pnpm dev
```

常用脚本：

| 脚本              | 说明                                      |
| ----------------- | ----------------------------------------- |
| `pnpm dev`        | 启动 Vite 示例。                          |
| `pnpm build`      | 构建 ESM、UMD、压缩 UMD、CSS 和类型声明。 |
| `pnpm check`      | 运行 Vue 和 TypeScript 检查。             |
| `pnpm lint`       | 运行 ESLint。                             |
| `pnpm lint:fix`   | 运行 ESLint 自动修复。                    |
| `pnpm format`     | 使用 Prettier 格式化文件。                |
| `pnpm docs:dev`   | 启动 VitePress 文档站点。                 |
| `pnpm docs:build` | 构建 VitePress 文档站点。                 |

## 构建产物

```text
dist/vue3-monaco-editor.es.js
dist/vue3-monaco-editor.umd.js
dist/vue3-monaco-editor.umd.min.js
dist/vue3-monaco-editor.css
types/vue3-monaco-editor.d.ts
```

## 注意事项

- 本包不会把 `vue` 和 `monaco-editor` 打进产物，它们都是外部 peer dependencies。
- 推荐在 Vite、Rollup、Webpack 等现代构建工具中使用。
- Monaco worker 的配置可能仍然取决于业务项目的构建工具。

## 许可证

MIT
