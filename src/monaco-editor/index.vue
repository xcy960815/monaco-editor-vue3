<template>
  <div ref="monacoEditorDom" class="monaco-editor-dom">monaco-editor-dom</div>
</template>
<script lang='ts'>
// import type { DatabaseOption, ThemeType } from "./type"
import * as monaco from 'monaco-editor'
// 拦截 command + f 快捷键
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js'
// sql 语法高亮
import 'monaco-editor/esm/vs/editor/contrib/hover/hover'
import type { PropType } from "vue"
import { defineComponent, onBeforeUnmount, onMounted, ref, toRaw, watch, } from 'vue'
// import SqlSnippets from "./snippets"

import type { FieldOption, DatabaseOption, TableOption, SortText, SuggestOption, Monaco, ThemeType } from "./type"

import { language as Language } from "monaco-editor/esm/vs/basic-languages/sql/sql.js"

// import "./test"

// 不知道为什么 通过imoport 引入的 SqlSnippets 报错
export class SqlSnippets {

  monaco: Monaco

  // 自定义关键字
  customKeywords: Array<string>

  databaseKeywords: Array<string>

  databaseOptions: Array<DatabaseOption>

  sortText: SortText

  constructor(customKeywords?: Array<string>, databaseOptions?: Array<DatabaseOption>) {

    this.sortText = {
      Database: '0',
      Table: '1',
      Column: '2',
      Keyword: '3',
    }

    // 记录自定义关键字
    this.customKeywords = customKeywords || []

    // 数据库关键字 将自定义关键字也柔和进去
    this.databaseKeywords = [
      ...Language.keywords,
      ...Language.operators,
      ...Language.builtinFunctions,
      ...this.customKeywords
    ]



    // 记录数据库选项
    this.databaseOptions = databaseOptions || []

    // editor 赋值
    this.monaco = monaco

  }

  /**
   * 动态设置数据库表&&数据库字段
   * @param {*} databaseOptions 数据库数据
   * @example [{ databaseName: '', tableOptions: [{ tableName: '', fielsOptions: [ { fielName:"" }] }] }]
   */
  setDatabaseOption(databaseOptions: Array<DatabaseOption>) {
    this.databaseOptions = databaseOptions
  }

  /**
   * 获取关于光标所有的文本
   * @param { monaco.editor.ITextModel } model
   * @param { monaco.Position } position
   * @return {
   *  textBeforePointer：光标前面当前行文本
   *  textBeforePointerMulti:光标前第一行到光标位置所有的文本
   *  textAfterPointer:光标后当前行文本
   *  textAfterPointerMulti:光标后到最后一行 最后一列 所有的文本
   * }
   */
  getTextByCursorPosition = (model: monaco.editor.ITextModel, position: monaco.Position): {
    textBeforePointer: string
    textBeforePointerMulti: string
    textAfterPointer: string
    textAfterPointerMulti: string
  } => {
    // 获取当前列和当前行
    const { lineNumber, column } = position

    // 光标前面当前行文本
    const textBeforePointer = model.getValueInRange({
      startLineNumber: lineNumber,
      startColumn: 0,
      endLineNumber: lineNumber,
      endColumn: column,
    })


    // 光标前第一行到光标位置所有的文本
    const textBeforePointerMulti = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 0,
      endLineNumber: lineNumber,
      endColumn: column,
    })


    // 光标后当前行文本
    const textAfterPointer = model.getValueInRange({
      startLineNumber: lineNumber,
      startColumn: column,
      endLineNumber: lineNumber,
      endColumn: model.getLineMaxColumn(model.getLineCount())
    })


    // 光标后到最后一行 最后一列 所有的文本
    const textAfterPointerMulti = model.getValueInRange({
      startLineNumber: lineNumber,
      startColumn: column,
      endLineNumber: model.getLineCount(),
      endColumn: model.getLineMaxColumn(model.getLineCount()),
    })


    // const textBeforePointerMultiSemicolon = textBeforePointerMulti.split(';')

    return {
      textBeforePointer,
      textBeforePointerMulti,
      textAfterPointer,
      textAfterPointerMulti
    }

  }

  /**
   * monaco提示方法
   * @param { monaco.editor.ITextModel } model
   * @param { monaco.Position } position
   */
  async provideCompletionItems(model: monaco.editor.ITextModel, position: monaco.Position) {
    // 获取关于光标周围的sql内容
    const {
      textBeforePointer,
      textBeforePointerMulti,
      // textAfterPointer,
      textAfterPointerMulti
    } = this.getTextByCursorPosition(model, position)

    // const nextTokens = textAfterPointer.trim().split(/\s+/)

    // const nextToken = nextTokens[0].toLowerCase()

    // 获取光标当前行所有的sql 并且去掉前后空格
    const textBeforeTokens = textBeforePointer.trim().split(/\s+/)

    // 光标前最后一个字段
    const textBeforeLastToken = textBeforeTokens[textBeforeTokens.length - 1].toLowerCase()

    if (textBeforeLastToken.endsWith('.')) {
      // 如果最后一个文本后面 包含. 判断这个点之前的内容是否是database 
      const textBeforeLastTokenNoDot = textBeforeLastToken.slice(0, textBeforeLastToken.length - 1)
      console.log("textBeforeLastTokenNoDot", textBeforeLastTokenNoDot);
      console.log("this.databaseOptions", this.databaseOptions);

      // 是否是数据库
      const isDatabase = Boolean(this.databaseOptions.find(
        (databaseOption: DatabaseOption) =>
          databaseOption.databaseName ===
          textBeforeLastTokenNoDot.replace(/^.*,/g, '')
      ))
      console.log("isDatabase", isDatabase);

      if (isDatabase) {
        // <库名>.<表名> 联想
        // 如果是数据库 就获取当前database 下面的 tableOptions
        const databaseName = textBeforeLastTokenNoDot.replace(/^.*,/g, '')
        return {
          suggestions: [
            ...this.getTableOptionsSuggestByDatabaseName(databaseName),
          ],
        }
      } else if (
        this.getTableNameAndTableAlia(
          textBeforePointerMulti.split(';')[
          textBeforePointerMulti.split(';').length - 1
          ] + textAfterPointerMulti.split(';')[0]
        )
      ) {
        const tableInfoList = this.getTableNameAndTableAlia(
          textBeforePointerMulti.split(';')[
          textBeforePointerMulti.split(';').length - 1
          ] + textAfterPointerMulti.split(';')[0]
        )
        const currentTable = tableInfoList.find((item) => item.tableAlia === textBeforeLastTokenNoDot.replace(/^.*,/g, ''))
        // <别名>.<字段> 联想
        if (currentTable && currentTable.tableName) {
          return {
            suggestions:
              this.getFieldOptionsSuggestByTableAlia(),
          }
        } else {
          return {
            suggestions: [],
          }
        }
      } else {
        return {
          suggestions: [],
        }
      }
      // 库名联想
    } else if (
      textBeforeLastToken === 'from' ||
      textBeforeLastToken === 'join' ||
      /(from|join)\s+.*?\s?,\s*$/.test(
        textBeforePointer.replace(/.*?\(/gm, '').toLowerCase()
      )
    ) {
      const dataBaseOptionsSuggest = this.getDataBaseOptionsSuggestions()
      return {
        suggestions: dataBaseOptionsSuggest,
      }

    } else if (
      ['select', 'where', 'order by', 'group by', 'by', 'and', 'or', 'having', 'distinct', 'on',].includes(textBeforeLastToken.replace(/.*?\(/g, '')) ||
      (textBeforeLastToken.endsWith('.') && !this.databaseOptions.find((databaseOption: DatabaseOption) => `${databaseOption.databaseName}.` === textBeforeLastToken)) ||
      /(select|where|order by|group by|by|and|or|having|distinct|on)\s+.*?\s?,\s*$/.test(textBeforePointer.toLowerCase())
    ) {
      // 字段联想
      return {
        suggestions: this.getFieldOptionsSuggestions(),
      }

    }

    // else if (this.customKeywords.toString().includes(textBeforeLastToken)) {
    //     // 自定义字段联想
    //     return {
    //         suggestions: this.getCustomSuggestions(textBeforeLastToken.startsWith('$')),
    //     }
    // }

    else {
      // 默认联想 数据库联想、关键字联想、表联想
      return {
        suggestions: [
          ...this.getDataBaseOptionsSuggestions(),
          ...this.getTableOptionsSuggestions(),
          ...this.getKeywordOptionsSuggestions(),
        ],
      }
    }
  }

  /**
   * 获取自定义联想建议
   */
  getCustomSuggestions(startsWith$: boolean): Array<SuggestOption> {
    return this.customKeywords.map((customKeyword) => ({
      label: customKeyword,
      kind: this.monaco.languages.CompletionItemKind.Keyword,
      detail: '自定义联想',
      sortText: this.sortText.Keyword,
      // Fix插入两个$符号
      insertText: startsWith$ ? customKeyword.slice(1) : customKeyword,
    }))
  }


  /**
   * 获取数据库库名联想建议
   */
  getDataBaseOptionsSuggestions = (): Array<SuggestOption> => {
    return this.databaseOptions.map((databaseOption: DatabaseOption) => {
      return {
        label: databaseOption.databaseName || '',
        kind: this.monaco.languages.CompletionItemKind.Class,
        detail: `<数据库>`,
        sortText: this.sortText.Database,
        insertText: databaseOption.databaseName || '',
      }
    })
  }

  /**
   * 获取关键字联想建议
   * @param {*} keyword
   */
  getKeywordOptionsSuggestions = (): Array<SuggestOption> => {
    return this.databaseKeywords.map((databaseKeyword: string) => ({
      label: databaseKeyword,
      kind: this.monaco.languages.CompletionItemKind.Keyword,
      detail: '<关键字>',
      sortText: this.sortText.Keyword,
      // Fix插入两个$符号
      insertText: databaseKeyword.startsWith('$')
        ? databaseKeyword.slice(1)
        : databaseKeyword,
    }))
  }

  /**
   * 获取数据库表名建议
   * @return { Array<SuggestOption> } []
   */
  getTableOptionsSuggestions = (): Array<SuggestOption> => {
    const suggestOptions: Array<SuggestOption> = []
    this.databaseOptions.forEach((databaseOption: DatabaseOption) => {
      databaseOption.tableOptions.forEach((tableOption: TableOption) => {
        suggestOptions.push({
          label: tableOption.tableName || '',
          kind: this.monaco.languages.CompletionItemKind.Struct,
          detail: `<表> ${databaseOption.databaseName} ${tableOption.tableComment || ''}`,
          sortText: this.sortText.Table,
          insertText: tableOption.tableName || '',
          documentation: tableOption.tableComment || '',
        })
      })
    })
    return suggestOptions
  }
  /**
   * 通过数据库名 来获取 当前数据库下面的 table 联想选项
   * @param { string } databaseName 
   * @returns { Array<SuggestOption> } []
   */
  getTableOptionsSuggestByDatabaseName = (databaseName: string): Array<SuggestOption> => {
    // 从当前输入的数据库当中获取 所有的数据
    const currentDatabase = this.databaseOptions.find((databaseOption: DatabaseOption) => databaseOption.databaseName === databaseName)
    return currentDatabase ? currentDatabase.tableOptions.map((tableOption: TableOption) => ({
      label: tableOption.tableName || '',
      kind: this.monaco.languages.CompletionItemKind.Struct,
      detail: `<表> ${currentDatabase.databaseName} ${tableOption.tableComment || ''}`,
      sortText: this.sortText.Table,
      insertText: tableOption.tableName || '',
      documentation: tableOption.tableComment || '',
    })) : []
  }

  /**
   * 获取所有表字段
   * @return {Array<SuggestOption>} []
   */
  getFieldOptionsSuggestions = (): Array<SuggestOption> => {
    const defaultFieldOptions: Array<SuggestOption> = []
    this.databaseOptions.forEach((databaseOption: DatabaseOption) => {
      databaseOption.tableOptions.forEach((tableOption: TableOption) => {
        tableOption.fieldOptions && tableOption.fieldOptions.forEach(
          (fieldOption: FieldOption) => {
            defaultFieldOptions.push({
              label: fieldOption.fieldName || '',
              kind: this.monaco.languages.CompletionItemKind.Field,
              detail: `<字段> ${fieldOption.fieldComment || ''} <${fieldOption.fieldName}>`,
              sortText: this.sortText.Column,
              insertText: fieldOption.fieldName || '',
              documentation: {
                value: `
  ### 数据库: ${fieldOption.databaseName}
  ### 表: ${fieldOption.tableName}
  ### 注释: ${fieldOption.fieldComment || ''}`,
              },
            })
          }
        )
      })
    })
    return defaultFieldOptions
  }

  /**
   * 根据别名获取所有表字段
   * @return {Array<SuggestOption>} []
   */
  getFieldOptionsSuggestByTableAlia = (): Array<SuggestOption> => {
    const defaultFieldOptions: Array<SuggestOption> = []
    this.databaseOptions.forEach((databaseOption: DatabaseOption) => {
      databaseOption.tableOptions.forEach((tableOption: TableOption) => {
        tableOption.fieldOptions &&
          tableOption.fieldOptions.forEach(
            (fieldOption: FieldOption) => {
              defaultFieldOptions.push({
                label: fieldOption.fieldName || '',
                kind: this.monaco.languages.CompletionItemKind.Field,
                detail: `<字段> ${fieldOption.fieldComment || ''} <${fieldOption.fieldType}>`,
                sortText: this.sortText.Column,
                insertText: fieldOption.fieldName || '',
                documentation: {
                  value: `
  ### 数据库: ${fieldOption.databaseName}
  ### 表: ${fieldOption.tableName}
  ### 注释: ${fieldOption.fieldComment || ''}`,
                },
              })
            }
          )
      })
    })
    return defaultFieldOptions
  }

  /**
   * 获取sql中所有的表名和别名
   * @param {*} sqlText SQL字符串
   * @return {Array<{tableName: string, tableAlia: string }>} []
   */
  getTableNameAndTableAlia = (sqlText: string): Array<{
    tableName: string
    tableAlia: string
  }> => {

    const regTableAliaFrom = /(^|(\s+))from\s+([^\s]+(\s+|(\s+as\s+))[^\s]+(\s+|,)\s*)+(\s+(where|left|right|full|join|inner|union))?/gi

    const regTableAliaJoin = /(^|(\s+))join\s+([^\s]+)\s+(as\s+)?([^\s]+)\s+on/gi

    const regTableAliaFromList = sqlText.match(regTableAliaFrom) || []

    const regTableAliaJoinList = sqlText.match(regTableAliaJoin) || []

    const strList = [
      ...regTableAliaFromList.map((item) => item.replace(/(^|(\s+))from\s+/gi, '').replace(/\s+(where|left|right|full|join|inner|union)((\s+.*?$)|$)/gi, '').replace(/\s+as\s+/gi, ' ').trim()),
      ...regTableAliaJoinList.map((item) => item.replace(/(^|(\s+))join\s+/gi, '').replace(/\s+on((\s+.*?$)|$)/, '').replace(/\s+as\s+/gi, ' ').trim()),
    ]

    const tableList: Array<{
      tableName: string
      tableAlia: string
    }> = []

    strList.map((tableAndAlia) => {
      tableAndAlia.split(',').forEach((item) => {
        const tableName = item.trim().split(/\s+/)[0]
        const tableAlia = item.trim().split(/\s+/)[1]
        tableList.push({
          tableName,
          tableAlia,
        })
      })
    })
    return tableList
  }
}

export default defineComponent({
  name: "MonacoEditor",

  props: {
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
    },

    // 编译器主题
    monacoEditorTheme: {
      type: String as PropType<ThemeType>,
      default: "vs"
    }
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {

    // monacoEditor 挂载的dom节点
    const monacoEditorDom = ref<HTMLDivElement>()

    // monacoEditor 实例
    const monacoEditor = ref<monaco.editor.IStandaloneCodeEditor>()

    const completionItemProvider = ref<monaco.IDisposable>()

    // 编译器的默认配置
    const monacoEditorDefaultOption: monaco.editor.IStandaloneEditorConstructionOptions = {
      suggestSelection: "first",
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
      const hasTextFocus = monacoEditor.value?.hasTextFocus()
      if (!hasTextFocus) toRaw(monacoEditor.value)?.setValue(newSql)
    })

    // 监听编译器样式参数的变化 start
    watch(() => props.height, () => {
      setMonacoEditorStyle()
    })
    watch(() => props.width, () => {
      setMonacoEditorStyle()
    })
    // 监听编译器样式参数的变化 end

    // 监听 monaco-editor 主题
    watch(() => props.monacoEditorTheme, (monacoEditorTheme: ThemeType) => {
      monaco.editor.setTheme(monacoEditorTheme)
    })

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
      )


      completionItemProvider.value = monaco.languages.registerCompletionItemProvider('sql', {
        // 提示的触发字符
        triggerCharacters: [' ', '.', ...props.triggerCharacters],
        // 因为在js代码中 range 属性不配置也可以正常显示  所以 在这里避免代码抛错  使用了一个 别名 
        provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => sqlSnippets.provideCompletionItems(model, position) as monaco.languages.ProviderResult<monaco.languages.CompletionList>
      })
      // 创建editor实例
      monacoEditor.value = monaco.editor.create(monacoEditorDom.value!, JSON.stringify(props.monacoEditorOption) === "{}" ? monacoEditorDefaultOption : props.monacoEditorOption)
      // 渲染 编译器 宽高
      if (props.height) setMonacoEditorStyle()

      // 监听编译器里面的值的变化
      monacoEditor.value.onDidChangeModelContent(() => { emit("update:modelValue", toRaw(monacoEditor.value!).getValue()) })
    }

    onMounted(() => {
      initEditor()
    })

    // 离开时销毁
    onBeforeUnmount(() => {
      completionItemProvider.value?.dispose()
    })

    return {
      initEditor,
      monacoEditorDom
    }
  },

})
</script>