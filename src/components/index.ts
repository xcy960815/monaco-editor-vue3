import type { App, DefineComponent, Plugin } from 'vue'
import type * as monaco from 'monaco-editor'

import { MonacoEditor as MonacoEditorSource } from './monaco-editor'
import type { DatabaseOption, ThemeType } from './types'

export type {
  DatabaseOption,
  FieldOption,
  Monaco,
  SortText,
  SuggestOption,
  TableOption,
  ThemeType,
} from './types'

export type MonacoEditorProps = {
  modelValue?: string
  triggerCharacters?: string[]
  customKeywords?: string[]
  databaseOptions?: DatabaseOption[]
  width?: number
  height?: number
  monacoEditorOption?: monaco.editor.IStandaloneEditorConstructionOptions
  monacoEditorTheme?: ThemeType
}

export type MonacoEditorExpose = {
  initEditor: () => void
  resetEditor: () => void
}

export type MonacoEditorComponent = DefineComponent<
  MonacoEditorProps,
  MonacoEditorExpose
>

export const MonacoEditor =
  MonacoEditorSource as unknown as MonacoEditorComponent

const MonacoEditorPlugin = MonacoEditor as typeof MonacoEditor & Plugin

MonacoEditorPlugin.install = (app: App): void => {
  app.component(MonacoEditor.name || 'MonacoEditor', MonacoEditor)
}

export default MonacoEditorPlugin
