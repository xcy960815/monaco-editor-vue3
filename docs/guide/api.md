# API

## Props

| Name                 | Type                                   | Default | Description                                                                                        |
| -------------------- | -------------------------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| `modelValue`         | `string`                               | `''`    | Editor content.                                                                                    |
| `triggerCharacters`  | `string[]`                             | `[]`    | Extra completion trigger characters.                                                               |
| `customKeywords`     | `string[]`                             | `[]`    | Extra SQL completion keywords.                                                                     |
| `databaseOptions`    | `DatabaseOption[]`                     | `[]`    | Database, table and field completion data.                                                         |
| `width`              | `number \| string`                     | `0`     | Editor width. Numbers are pixels; percentages use parent width. Uses parent width when set to `0`. |
| `height`             | `number \| string`                     | `100`   | Editor height. Numbers are pixels; percentages use parent height.                                  |
| `monacoEditorOption` | `IStandaloneEditorConstructionOptions` | `{}`    | Native Monaco editor options.                                                                      |
| `monacoEditorTheme`  | `'vs' \| 'vs-dark' \| 'hc-black'`      | `'vs'`  | Monaco theme.                                                                                      |

## Events

| Name                | Description                          |
| ------------------- | ------------------------------------ |
| `update:modelValue` | Emitted when editor content changes. |

## Exposed Methods

| Name                  | Description                      |
| --------------------- | -------------------------------- |
| `initEditor`          | Initialize the editor instance.  |
| `resetEditor`         | Clear the editor content.        |
| `insertText`          | Insert text at the cursor.       |
| `getSelectedText`     | Get the current selected text.   |
| `replaceSelectedText` | Replace the current selection.   |
| `replaceText`         | Replace the full editor content. |
