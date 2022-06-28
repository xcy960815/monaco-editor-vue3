<template>
  <div ref="monacoEditorDom"></div>
</template>

<script lang="ts" setup>
import type { DatabaseOption } from "@/monaco-editor-core/snippets"
import SqlSnippets from '@/monaco-editor-core/snippets'
import * as monaco from 'monaco-editor'
// 拦截 command + f 快捷键
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js'
// sql 语法高亮
import 'monaco-editor/esm/vs/editor/contrib/hover/hover'
import type { PropType } from "vue"
import { nextTick, onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue'

const emit = defineEmits(["update:sql"])

const props = defineProps({
  // sql 语句
  modelValue: {
    type: String,
    default: () => '',
  },

  // 触发字符
  triggerCharacters: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },

  // 自定义关键字
  customKeywords: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },

  // 数据库数据
  databaseOptions: {
    type: Array as PropType<Array<DatabaseOption>>,
    default: () => [],
  },

  onInputField: {
    type: Function,
    default: () => [],
  },

  onInputTableAlia: {
    type: Function,
    default: () => [],
  },

  // 编译器的width
  width: {
    type: Number,
    default: () => 0,
  },

  // 编译器的高
  height: {
    type: Number,
    default: () => 100,
  },

  // 编译器配置项
  monacoEditorOption: {
    type: Object as PropType<monaco.editor.IStandaloneEditorConstructionOptions>,
    default: {}
  }
})



// monacoEditor 挂载的dom节点
const monacoEditorDom = ref<HTMLDivElement>()

// monacoEditor 实例
const monacoEditor = ref<monaco.editor.IStandaloneCodeEditor>()

const completionItemProvider = ref<monaco.IDisposable>()

// 编译器的默认配置
const monacoEditorDefaultOption: monaco.editor.IStandaloneEditorConstructionOptions = {
  fontFamily: "MONACO",
  lineHeight: 30,
  value: props.modelValue,
  language: 'sql',
  theme: 'vs-dark',
  selectOnLineNumbers: true,
  contextmenu: false, //关闭右键
  suggestOnTriggerCharacters: true,
  fontSize: 14,
  folding: false, // 是否折叠
  // 是否启用小地图
  minimap: {
    enabled: false
  }
}

// 做组件的双向绑定
watch(() => props.modelValue, (newSql: string) => {
  // 解决双向绑定换行 光标跳到第一行第一列的问题 
  if (!monacoEditor.value?.hasTextFocus()) {
    toRaw(monacoEditor.value)?.setValue(newSql)
  }
})

// 监听编译器样式参数的变化 start
watch(() => props.height, () => {
  setMonacoEditorStyle()
})
watch(() => props.width, () => {
  setMonacoEditorStyle()
})
// 监听编译器样式参数的变化 end




// 设置 编译器宽高
const setMonacoEditorStyle = () => {
  // 获取 monacoEditorDom 节点的父节点
  const parentElementWidth = window.getComputedStyle((monacoEditorDom.value as HTMLDivElement).parentElement!).width
  const parentElementWidthNumber = Number(parentElementWidth.substring(0, parentElementWidth.length - 2))
  toRaw(monacoEditor.value)?.layout({ width: props.width ? props.width : parentElementWidthNumber, height: props.height })
}

// 初始化 editor
const initEditor = () => {

  const sqlSnippets = new SqlSnippets(
    props.customKeywords,
    props.databaseOptions,
    props.onInputField,
    props.onInputTableAlia
  )


  completionItemProvider.value = monaco.languages.registerCompletionItemProvider('sql', {
    // 提示的触发字符
    triggerCharacters: [' ', '.', ...(props.triggerCharacters)],
    provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {
      return sqlSnippets.provideCompletionItems(model, position)
    }
  })

  // 创建editor实例
  monacoEditor.value = monaco.editor.create(monacoEditorDom.value!, JSON.stringify(props.monacoEditorOption) === "{}" ? monacoEditorDefaultOption : props.monacoEditorOption)

  // 渲染 编译器 宽高
  if (props.height) setMonacoEditorStyle()


  // 监听编译器里面的值的变化
  monacoEditor.value.onDidChangeModelContent(() => { emit("update:sql", toRaw(monacoEditor.value!).getValue()) })
}

onMounted(() => {
  nextTick(() => {
    initEditor()
  })
})

// 离开时销毁
onBeforeUnmount(() => {
  completionItemProvider.value?.dispose()
})

</script>
