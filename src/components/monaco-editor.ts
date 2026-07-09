import './monaco-editor.css'
import 'monaco-editor/esm/vs/editor/contrib/find/findController'
import 'monaco-editor/esm/vs/editor/contrib/hover/hover'

import * as monaco from 'monaco-editor'
import {
  PropType,
  defineComponent,
  h,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
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
      type: [Number, String] as PropType<number | string>,
      default: 0,
    },
    height: {
      type: [Number, String] as PropType<number | string>,
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
    const monacoEditor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(
      null,
    )
    const completionItemProvider = shallowRef<monaco.IDisposable | null>(null)
    const sqlSnippets = shallowRef<SqlSnippets | null>(null)
    const resizeObserver = shallowRef<ResizeObserver | null>(null)

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

    const getEditorSize = (
      size: number | string,
      parentSize: number,
      fallbackSize: number,
      useFallbackWhenZero = false,
    ): number => {
      if (typeof size === 'number') {
        return useFallbackWhenZero && size === 0 ? fallbackSize : size
      }

      const normalizedSize = size.trim()

      if (normalizedSize.endsWith('%')) {
        const percentValue = Number.parseFloat(normalizedSize)

        return Number.isFinite(percentValue) && parentSize
          ? (parentSize * percentValue) / 100
          : fallbackSize
      }

      const pixelValue = Number.parseFloat(normalizedSize)

      return Number.isFinite(pixelValue) ? pixelValue : fallbackSize
    }

    const setMonacoEditorStyle = (): void => {
      if (!monacoEditorDom.value || !monacoEditor.value) return

      const parentElement = monacoEditorDom.value.parentElement
      const parentElementRect = parentElement?.getBoundingClientRect()
      const parentElementWidth =
        parentElementRect?.width || monacoEditorDom.value.clientWidth
      const parentElementHeight =
        parentElementRect?.height || monacoEditorDom.value.clientHeight

      toRaw(monacoEditor.value).layout({
        width: getEditorSize(
          props.width,
          parentElementWidth || monacoEditorDom.value.clientWidth,
          parentElementWidth || monacoEditorDom.value.clientWidth,
          true,
        ),
        height: getEditorSize(
          props.height,
          parentElementHeight,
          typeof props.height === 'number'
            ? props.height
            : parentElementHeight || monacoEditorDom.value.clientHeight || 100,
        ),
      })
    }

    const shouldObserveParentSize = (): boolean =>
      props.width === 0 ||
      typeof props.width === 'string' ||
      typeof props.height === 'string'

    const initResizeObserver = (): void => {
      resizeObserver.value?.disconnect()
      resizeObserver.value = null

      if (!shouldObserveParentSize() || typeof ResizeObserver === 'undefined') {
        return
      }

      const parentElement = monacoEditorDom.value?.parentElement
      if (!parentElement) return

      resizeObserver.value = markRaw(
        new ResizeObserver(() => {
          setMonacoEditorStyle()
        }),
      )
      resizeObserver.value.observe(parentElement)
    }

    const initEditor = (): void => {
      if (!monacoEditorDom.value || monacoEditor.value) return

      sqlSnippets.value = new SqlSnippets(
        props.customKeywords,
        props.databaseOptions,
      )
      completionItemProvider.value = markRaw(
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
        }),
      )

      monacoEditor.value = markRaw(
        monaco.editor.create(monacoEditorDom.value, getEditorOption()),
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

    const insertText = (text: string): void => {
      if (!monacoEditor.value) return

      const editor = toRaw(monacoEditor.value)
      const position = editor.getPosition()
      if (!position) return

      editor.executeEdits('', [
        {
          range: new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column,
          ),
          text,
          forceMoveMarkers: true,
        },
      ])
      editor.focus()
    }

    const getSelectedText = (): string => {
      if (!monacoEditor.value) return ''

      const editor = toRaw(monacoEditor.value)
      const selection = editor.getSelection()
      const model = editor.getModel()

      if (!selection || selection.isEmpty() || !model) return ''

      return model.getValueInRange(selection)
    }

    const replaceSelectedText = (text: string): boolean => {
      if (!monacoEditor.value) return false

      const editor = toRaw(monacoEditor.value)
      const selection = editor.getSelection()
      if (!selection || selection.isEmpty()) return false

      editor.pushUndoStop()
      editor.executeEdits('', [
        {
          range: selection,
          text,
          forceMoveMarkers: true,
        },
      ])
      editor.pushUndoStop()
      editor.focus()

      return true
    }

    const replaceText = (text: string): void => {
      if (!monacoEditor.value) return

      const editor = toRaw(monacoEditor.value)
      const model = editor.getModel()
      if (!model) return

      editor.pushUndoStop()
      editor.executeEdits('', [
        {
          range: model.getFullModelRange(),
          text,
          forceMoveMarkers: true,
        },
      ])
      editor.pushUndoStop()
      editor.focus()
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
        initResizeObserver()
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
        initResizeObserver()
      })
    })

    onBeforeUnmount(() => {
      completionItemProvider.value?.dispose()
      resizeObserver.value?.disconnect()
      toRaw(monacoEditor.value)?.dispose()
      completionItemProvider.value = null
      resizeObserver.value = null
      monacoEditor.value = null
      sqlSnippets.value = null
    })

    expose({
      initEditor,
      resetEditor,
      insertText,
      getSelectedText,
      replaceSelectedText,
      replaceText,
    })

    return () =>
      h('div', {
        ref: monacoEditorDom,
        class: 'monaco-editor-dom',
      })
  },
})
