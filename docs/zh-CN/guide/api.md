# API

## Props

| 名称                 | 类型                                   | 默认值 | 说明                                  |
| -------------------- | -------------------------------------- | ------ | ------------------------------------- |
| `modelValue`         | `string`                               | `''`   | 编辑器内容。                          |
| `triggerCharacters`  | `string[]`                             | `[]`   | 额外触发补全的字符。                  |
| `customKeywords`     | `string[]`                             | `[]`   | 自定义 SQL 补全关键字。               |
| `databaseOptions`    | `DatabaseOption[]`                     | `[]`   | 库、表、字段补全数据。                |
| `width`              | `number`                               | `0`    | 编辑器宽度，为 `0` 时使用父容器宽度。 |
| `height`             | `number`                               | `100`  | 编辑器高度。                          |
| `monacoEditorOption` | `IStandaloneEditorConstructionOptions` | `{}`   | Monaco 原生配置。                     |
| `monacoEditorTheme`  | `'vs' \| 'vs-dark' \| 'hc-black'`      | `'vs'` | Monaco 主题。                         |

## 事件

| 名称                | 说明                   |
| ------------------- | ---------------------- |
| `update:modelValue` | 编辑器内容变化时触发。 |

## 暴露方法

| 名称          | 说明               |
| ------------- | ------------------ |
| `initEditor`  | 初始化编辑器实例。 |
| `resetEditor` | 清空编辑器内容。   |
