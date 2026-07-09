# Architecture

## Public Entry

`src/components/index.ts` is the package entry used by Rollup. It:

- imports the source component from `src/components/monaco-editor.ts`
- re-exports public data types from `src/components/types.ts`
- defines `MonacoEditorProps`, `MonacoEditorExpose`, and `MonacoEditorComponent`
- exports named `MonacoEditor`
- creates the default plugin export by adding `install(app)` and registering the component as `MonacoEditor`

Consumers can either import the component directly or install the default plugin.

## Component Lifecycle

`src/components/monaco-editor.ts` defines `MonacoEditor` with `defineComponent`.

Important refs:

- `monacoEditorDom`: the div that hosts Monaco.
- `monacoEditor`: the `IStandaloneCodeEditor` instance.
- `completionItemProvider`: disposable SQL completion provider.
- `sqlSnippets`: instance of `SqlSnippets` used by Monaco completion.

Lifecycle:

1. On mount, `nextTick()` calls `initEditor()`.
2. `initEditor()` creates `SqlSnippets`, registers a SQL completion provider, creates the Monaco editor, lays it out, and wires `onDidChangeModelContent`.
3. On content changes, the component emits `update:modelValue`.
4. On unmount, the completion provider and editor are disposed.

## Props And Data Flow

Key props:

- `modelValue`: source for initial content and `v-model` updates.
- `triggerCharacters`: extra completion trigger characters. Space and `.` are always included.
- `customKeywords`: extra SQL keyword suggestions.
- `databaseOptions`: database/table/field metadata used by completion.
- `width` and `height`: layout inputs. `width: 0` falls back to parent width.
- `monacoEditorOption`: native Monaco editor options merged over component defaults.
- `monacoEditorTheme`: theme used by default editor options and theme watcher.

Watchers:

- `modelValue`: updates editor content only when the editor does not have text focus and the value differs.
- `[height, width]`: relayouts the editor.
- `monacoEditorTheme`: calls `monaco.editor.setTheme`.
- `[customKeywords, databaseOptions]`: deep watcher updates the existing `SqlSnippets` instance.

Exposed methods:

- `initEditor()`: initializes Monaco if it has not already been created.
- `resetEditor()`: sets editor content to an empty string.

## Editor Options

`createDefaultEditorOption()` sets SQL-oriented defaults:

- `language: 'sql'`
- `theme: props.monacoEditorTheme`
- suggestions on trigger characters
- minimap disabled
- folding disabled
- context menu disabled
- default font and line-height choices

`getEditorOption()` merges `props.monacoEditorOption` over defaults, while preserving explicit override behavior for `value`, `language`, and `theme`.

## Completion Engine

`src/components/snippets.ts` exports `SqlSnippets`.

Constructor inputs:

- `customKeywords`
- `databaseOptions`

Internal sources:

- Monaco SQL language keywords, operators, and built-in functions from `monaco-editor/esm/vs/basic-languages/sql/sql.js`
- caller-provided custom keywords
- caller-provided database/table/field metadata

Completion behavior:

- `databaseName.` suggests tables under that database.
- `alias.` suggests fields for the inferred aliased table when possible.
- `from` and `join` contexts suggest database names.
- SQL clause contexts such as `select`, `where`, `and`, `or`, `on`, `group by`, and `order by` suggest fields.
- fallback suggestions include databases, tables, and keywords.

Sort order is encoded by `SortText`:

- database: `0`
- table: `1`
- column: `2`
- keyword: `3`

## Public Types

Primary metadata types live in `src/components/types.ts`:

- `DatabaseOption`
- `TableOption`
- `FieldOption`
- `ThemeType`
- `SuggestOption`

If these change, update usage docs and rebuild declarations with `pnpm build`.

## Styling

`src/components/monaco-editor.ts` imports `src/components/monaco-editor.css`. Rollup extracts this into `dist/vue3-monaco-editor.css`.

Consumers are expected to import:

```ts
import 'vue3-monaco-editor/style.css'
```

## Extension Points

Good places to extend behavior:

- Add props in `monaco-editor.ts`, then mirror public prop types in `index.ts`.
- Add suggestion rules in `SqlSnippets.provideCompletionItems`.
- Add new completion metadata fields in `types.ts`, then update README and docs.
- Add Monaco default option changes in `createDefaultEditorOption`.

Keep Monaco-specific setup inside `monaco-editor.ts` and SQL parsing/suggestion logic inside `snippets.ts`.
