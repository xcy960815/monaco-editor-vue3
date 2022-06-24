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
  sql: {
    type: String,
    default: () => ''
  },

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

  width: {
    type: Number,
    default: () => 0,
  },

  height: {
    type: Number,
    default: () => 0,
  },
})

// 做组件的双向绑定
watch(() => props.sql, (newSql: string) => {
  // 解决双向绑定换行 光标跳到第一行第一列的问题 
  if (!monacoEditor.value?.hasTextFocus()) {
    toRaw(monacoEditor.value)?.setValue(newSql)
  }
})
// monacoEditor 挂载的dom节点
const monacoEditorDom = ref<HTMLDivElement>()
// monacoEditor 实例
const monacoEditor = ref<monaco.editor.IStandaloneCodeEditor>()

const completionItemProvider = ref<monaco.IDisposable>()

// 初始化 editor
const initEditor = () => {
  monacoEditorDom.value!.style.height = props.height + 'px'
  monacoEditorDom.value!.style.width = "100%"
  const sqlSnippets = new SqlSnippets(
    monaco,
    props.customKeywords,
    props.databaseOptions,
    props.onInputField,
    props.onInputTableAlia
  )

  completionItemProvider.value = monaco.languages.registerCompletionItemProvider('sql', {
    triggerCharacters: [' ', '.', ...(props.triggerCharacters)],
    provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {
      return sqlSnippets.provideCompletionItems(model, position)
    }
  })


  monacoEditor.value = monaco.editor.create(monacoEditorDom.value!, {
    value: props.sql,
    language: 'sql',
    theme: 'vs-dark',
    selectOnLineNumbers: true,
    contextmenu: false, //关闭右键
    suggestOnTriggerCharacters: true,
    fontSize: 16,
    folding: false, // 是否折叠
    minimap: {
      enabled: false
    }
  })

  // 渲染 编译器 宽高
  // if (props.height)
  //   monacoEditor.value.layout({ width: props.width ? props.width : 0, height: props.height })

  // 监听值的变化
  monacoEditor.value.onDidChangeModelContent(
    (_event: monaco.editor.IModelContentChangedEvent) => {
      emit("update:sql", toRaw(monacoEditor.value!).getValue())
    }
  )
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
<style lang="less" scoped>
:deep(.monaco-editor) {
  padding: 10px 0;
}

.editor-area {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  padding: 5px;
  padding-left: 0;
  background-color: #fff;
  box-sizing: border-box;

  &.full {
    position: fixed;
    left: calc(10vw / 2);
    top: calc(10vh / 2);
    box-shadow: 0 0 22px 10px rgba(0, 0, 0, 0.3);
    width: 90vw !important;
    height: 90vh !important;
    z-index: 9999;
  }

  .tools {
    z-index: 888;
    position: absolute;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 2px;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    left: 0;
    bottom: 0px;
    top: 0;

    .expand {
      cursor: pointer;
      line-height: 0;
      margin-top: 5px;
    }
  }
}
</style>
