import './monaco-editor.css'
import 'monaco-editor/esm/vs/editor/contrib/find/findController'
import 'monaco-editor/esm/vs/editor/contrib/hover/hover'

import * as monaco from 'monaco-editor'
import {
  PropType,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  toRaw,
  watch,
} from 'vue'

import { SqlSnippets } from './snippets'
import type { DatabaseOption, ThemeType } from './types'

export const MonacoEditor = defineComponent({
  name: 'MonacoEditor',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    triggerCharacters: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
    customKeywords: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
    databaseOptions: {
      type: Array as PropType<Array<DatabaseOption>>,
      default: () => [],
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 100,
    },
    monacoEditorOption: {
      type: Object as PropType<monaco.editor.IStandaloneEditorConstructionOptions>,
      default: () => ({}),
    },
    monacoEditorTheme: {
      type: String as PropType<ThemeType>,
      default: 'vs',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, expose }) {
    const monacoEditorDom = ref<HTMLDivElement | null>(null)
    const monacoEditor = ref<monaco.editor.IStandaloneCodeEditor | null>(null)
    const completionItemProvider = ref<monaco.IDisposable | null>(null)
    const sqlSnippets = ref<SqlSnippets | null>(null)

    const createDefaultEditorOption =
      (): monaco.editor.IStandaloneEditorConstructionOptions => ({
        acceptSuggestionOnCommitCharacter: false,
        suggestSelection: 'first',
        fontFamily: 'MONACO',
        lineHeight: 30,
        value: props.modelValue,
        language: 'sql',
        theme: props.monacoEditorTheme,
        selectOnLineNumbers: true,
        contextmenu: false,
        suggestOnTriggerCharacters: true,
        fontSize: 14,
        folding: false,
        minimap: {
          enabled: false,
        },
      })

    const getEditorOption =
      (): monaco.editor.IStandaloneEditorConstructionOptions => ({
        ...createDefaultEditorOption(),
        ...props.monacoEditorOption,
        value: props.monacoEditorOption.value ?? props.modelValue,
        language: props.monacoEditorOption.language ?? 'sql',
        theme: props.monacoEditorOption.theme ?? props.monacoEditorTheme,
      })

    const setMonacoEditorStyle = (): void => {
      if (!monacoEditorDom.value || !monacoEditor.value) return

      const parentElement = monacoEditorDom.value.parentElement
      const parentElementWidth = parentElement
        ? Number.parseFloat(window.getComputedStyle(parentElement).width)
        : monacoEditorDom.value.clientWidth

      toRaw(monacoEditor.value).layout({
        width:
          props.width ||
          parentElementWidth ||
          monacoEditorDom.value.clientWidth,
        height: props.height,
      })
    }

    const initEditor = (): void => {
      if (!monacoEditorDom.value || monacoEditor.value) return

      sqlSnippets.value = new SqlSnippets(
        props.customKeywords,
        props.databaseOptions,
      )
      completionItemProvider.value =
        monaco.languages.registerCompletionItemProvider('sql', {
          triggerCharacters: [' ', '.', ...props.triggerCharacters],
          provideCompletionItems: (
            model: monaco.editor.ITextModel,
            position: monaco.Position,
          ) =>
            sqlSnippets.value?.provideCompletionItems(
              model,
              position,
            ) as monaco.languages.ProviderResult<monaco.languages.CompletionList>,
        })

      monacoEditor.value = monaco.editor.create(
        monacoEditorDom.value,
        getEditorOption(),
      )
      setMonacoEditorStyle()

      monacoEditor.value.onDidChangeModelContent(() => {
        if (!monacoEditor.value) return

        emit('update:modelValue', toRaw(monacoEditor.value).getValue())
      })
    }

    const resetEditor = (): void => {
      toRaw(monacoEditor.value)?.setValue('')
    }

    watch(
      () => props.modelValue,
      (newSql: string) => {
        if (!monacoEditor.value) return

        const editor = toRaw(monacoEditor.value)
        const hasTextFocus = editor.hasTextFocus()

        if (!hasTextFocus && editor.getValue() !== newSql) {
          editor.setValue(newSql)
        }
      },
    )

    watch(
      () => [props.height, props.width],
      () => {
        setMonacoEditorStyle()
      },
    )

    watch(
      () => props.monacoEditorTheme,
      (monacoEditorTheme: ThemeType) => {
        monaco.editor.setTheme(monacoEditorTheme)
      },
    )

    watch(
      () => [props.customKeywords, props.databaseOptions],
      () => {
        sqlSnippets.value?.updateOptions(
          props.customKeywords,
          props.databaseOptions,
        )
      },
      {
        deep: true,
      },
    )

    onMounted(() => {
      nextTick(() => {
        initEditor()
      })
    })

    onBeforeUnmount(() => {
      completionItemProvider.value?.dispose()
      toRaw(monacoEditor.value)?.dispose()
    })

    expose({
      initEditor,
      resetEditor,
    })

    return () =>
      h('div', {
        ref: monacoEditorDom,
        class: 'monaco-editor-dom',
      })
  },
})
