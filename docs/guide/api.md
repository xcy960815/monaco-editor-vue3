# API

## Props

| Name                 | Type                                   | Default | Description                                      |
| -------------------- | -------------------------------------- | ------- | ------------------------------------------------ |
| `modelValue`         | `string`                               | `''`    | Editor content.                                  |
| `triggerCharacters`  | `string[]`                             | `[]`    | Extra completion trigger characters.             |
| `customKeywords`     | `string[]`                             | `[]`    | Extra SQL completion keywords.                   |
| `databaseOptions`    | `DatabaseOption[]`                     | `[]`    | Database, table and field completion data.       |
| `width`              | `number`                               | `0`     | Editor width. Uses parent width when set to `0`. |
| `height`             | `number`                               | `100`   | Editor height.                                   |
| `monacoEditorOption` | `IStandaloneEditorConstructionOptions` | `{}`    | Native Monaco editor options.                    |
| `monacoEditorTheme`  | `'vs' \| 'vs-dark' \| 'hc-black'`      | `'vs'`  | Monaco theme.                                    |

## Events

| Name                | Description                          |
| ------------------- | ------------------------------------ |
| `update:modelValue` | Emitted when editor content changes. |

## Exposed Methods

| Name          | Description                     |
| ------------- | ------------------------------- |
| `initEditor`  | Initialize the editor instance. |
| `resetEditor` | Clear the editor content.       |
