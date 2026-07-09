import * as monaco from 'monaco-editor'
import { language as Language } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js'

import type {
  DatabaseOption,
  FieldOption,
  Monaco,
  SortText,
  SuggestOption,
  TableOption,
} from './types'

export class SqlSnippets {
  private monaco: Monaco

  private customKeywords: Array<string>

  private databaseKeywords: Array<string>

  private databaseOptions: Array<DatabaseOption>

  private sortText: SortText

  constructor(
    customKeywords?: Array<string>,
    databaseOptions?: Array<DatabaseOption>,
  ) {
    this.sortText = {
      Database: '0',
      Table: '1',
      Column: '2',
      Keyword: '3',
    }

    this.customKeywords = customKeywords || []
    this.databaseOptions = databaseOptions || []
    this.databaseKeywords = this.getDatabaseKeywords()
    this.monaco = monaco
  }

  public updateOptions(
    customKeywords?: Array<string>,
    databaseOptions?: Array<DatabaseOption>,
  ): void {
    this.customKeywords = customKeywords || []
    this.databaseOptions = databaseOptions || []
    this.databaseKeywords = this.getDatabaseKeywords()
  }

  private getDatabaseKeywords(): Array<string> {
    return [
      ...Language.keywords,
      ...Language.operators,
      ...Language.builtinFunctions,
      ...this.customKeywords,
    ]
  }

  public getTextByCursorPosition(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
  ): {
    textBeforePointer: string
    textBeforePointerMulti: string
    textAfterPointer: string
    textAfterPointerMulti: string
  } {
    const { lineNumber, column } = position

    const textBeforePointer = model.getValueInRange({
      startLineNumber: lineNumber,
      startColumn: 1,
      endLineNumber: lineNumber,
      endColumn: column,
    })

    const textBeforePointerMulti = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: lineNumber,
      endColumn: column,
    })

    const textAfterPointer = model.getValueInRange({
      startLineNumber: lineNumber,
      startColumn: column,
      endLineNumber: lineNumber,
      endColumn: model.getLineMaxColumn(lineNumber),
    })

    const textAfterPointerMulti = model.getValueInRange({
      startLineNumber: lineNumber,
      startColumn: column,
      endLineNumber: model.getLineCount(),
      endColumn: model.getLineMaxColumn(model.getLineCount()),
    })

    return {
      textBeforePointer,
      textBeforePointerMulti,
      textAfterPointer,
      textAfterPointerMulti,
    }
  }

  public async provideCompletionItems(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
  ): Promise<{ suggestions: Array<SuggestOption> }> {
    const { textBeforePointer, textBeforePointerMulti, textAfterPointerMulti } =
      this.getTextByCursorPosition(model, position)

    const textBeforeTokens = textBeforePointer.trim().split(/\s+/)
    const textBeforeLastToken =
      textBeforeTokens[textBeforeTokens.length - 1].toLowerCase()

    if (textBeforeLastToken.endsWith('.')) {
      const textBeforeLastTokenNoDot = textBeforeLastToken.slice(0, -1)
      const currentName = textBeforeLastTokenNoDot.replace(/^.*,/g, '')
      const databaseOption = this.databaseOptions.find(
        (databaseOption: DatabaseOption) =>
          databaseOption.databaseName.toLowerCase() === currentName,
      )

      if (databaseOption) {
        return {
          suggestions: this.getTableOptionsSuggestByDatabaseName(currentName),
        }
      }

      const currentSqlText =
        textBeforePointerMulti.split(';')[
          textBeforePointerMulti.split(';').length - 1
        ] + textAfterPointerMulti.split(';')[0]
      const tableInfoList = this.getTableNameAndTableAlia(currentSqlText)
      const currentTable = tableInfoList.find(
        (item) => item.tableAlia.toLowerCase() === currentName,
      )

      return {
        suggestions: currentTable
          ? this.getFieldOptionsSuggestByTableName(currentTable.tableName)
          : [],
      }
    }

    if (
      textBeforeLastToken === 'from' ||
      textBeforeLastToken === 'join' ||
      /(from|join)\s+.*?\s?,\s*$/.test(
        textBeforePointer.replace(/.*?\(/gm, '').toLowerCase(),
      )
    ) {
      return {
        suggestions: this.getDatabaseOptionsSuggestions(),
      }
    }

    if (
      [
        'select',
        'where',
        'order by',
        'group by',
        'by',
        'and',
        'or',
        'having',
        'distinct',
        'on',
      ].includes(textBeforeLastToken.replace(/.*?\(/g, '')) ||
      (textBeforeLastToken.endsWith('.') &&
        !this.databaseOptions.find(
          (databaseOption: DatabaseOption) =>
            `${databaseOption.databaseName}.`.toLowerCase() ===
            textBeforeLastToken,
        )) ||
      /(select|where|order by|group by|by|and|or|having|distinct|on)\s+.*?\s?,\s*$/.test(
        textBeforePointer.toLowerCase(),
      )
    ) {
      return {
        suggestions: this.getFieldOptionsSuggestions(),
      }
    }

    return {
      suggestions: [
        ...this.getDatabaseOptionsSuggestions(),
        ...this.getTableOptionsSuggestions(),
        ...this.getKeywordOptionsSuggestions(),
      ],
    }
  }

  public getDatabaseOptionsSuggestions(): Array<SuggestOption> {
    return this.databaseOptions.map((databaseOption: DatabaseOption) => ({
      label: databaseOption.databaseName || '',
      kind: this.monaco.languages.CompletionItemKind.Class,
      detail: '<数据库>',
      sortText: this.sortText.Database,
      insertText: databaseOption.databaseName || '',
    }))
  }

  public getKeywordOptionsSuggestions(): Array<SuggestOption> {
    return this.databaseKeywords.map((databaseKeyword: string) => ({
      label: databaseKeyword,
      kind: this.monaco.languages.CompletionItemKind.Keyword,
      detail: '<关键字>',
      sortText: this.sortText.Keyword,
      insertText: databaseKeyword.startsWith('$')
        ? databaseKeyword.slice(1)
        : databaseKeyword,
    }))
  }

  public getTableOptionsSuggestions(): Array<SuggestOption> {
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

  public getTableOptionsSuggestByDatabaseName(
    databaseName: string,
  ): Array<SuggestOption> {
    const currentDatabase = this.databaseOptions.find(
      (databaseOption: DatabaseOption) =>
        databaseOption.databaseName.toLowerCase() ===
        databaseName.toLowerCase(),
    )

    return currentDatabase
      ? currentDatabase.tableOptions.map((tableOption: TableOption) => ({
          label: tableOption.tableName || '',
          kind: this.monaco.languages.CompletionItemKind.Struct,
          detail: `<表> ${currentDatabase.databaseName} ${tableOption.tableComment || ''}`,
          sortText: this.sortText.Table,
          insertText: tableOption.tableName || '',
          documentation: tableOption.tableComment || '',
        }))
      : []
  }

  public getFieldOptionsSuggestions(): Array<SuggestOption> {
    const defaultFieldOptions: Array<SuggestOption> = []

    this.databaseOptions.forEach((databaseOption: DatabaseOption) => {
      databaseOption.tableOptions.forEach((tableOption: TableOption) => {
        tableOption.fieldOptions?.forEach((fieldOption: FieldOption) => {
          defaultFieldOptions.push(this.createFieldSuggestion(fieldOption))
        })
      })
    })

    return defaultFieldOptions
  }

  public getFieldOptionsSuggestByTableName(
    tableName: string,
  ): Array<SuggestOption> {
    const normalizedTableName = tableName.toLowerCase().split('.').pop()
    const defaultFieldOptions: Array<SuggestOption> = []

    this.databaseOptions.forEach((databaseOption: DatabaseOption) => {
      databaseOption.tableOptions.forEach((tableOption: TableOption) => {
        if (tableOption.tableName.toLowerCase() !== normalizedTableName) return

        tableOption.fieldOptions?.forEach((fieldOption: FieldOption) => {
          defaultFieldOptions.push(this.createFieldSuggestion(fieldOption))
        })
      })
    })

    return defaultFieldOptions
  }

  public getTableNameAndTableAlia(sqlText: string): Array<{
    tableName: string
    tableAlia: string
  }> {
    const regTableAliaFrom =
      /(^|(\s+))from\s+([^\s]+(\s+|(\s+as\s+))[^\s]+(\s+|,)\s*)+(\s+(where|left|right|full|join|inner|union))?/gi
    const regTableAliaJoin =
      /(^|(\s+))join\s+([^\s]+)\s+(as\s+)?([^\s]+)\s+on/gi
    const regTableAliaFromList = sqlText.match(regTableAliaFrom) || []
    const regTableAliaJoinList = sqlText.match(regTableAliaJoin) || []
    const strList = [
      ...regTableAliaFromList.map((item) =>
        item
          .replace(/(^|(\s+))from\s+/gi, '')
          .replace(
            /\s+(where|left|right|full|join|inner|union)((\s+.*?$)|$)/gi,
            '',
          )
          .replace(/\s+as\s+/gi, ' ')
          .trim(),
      ),
      ...regTableAliaJoinList.map((item) =>
        item
          .replace(/(^|(\s+))join\s+/gi, '')
          .replace(/\s+on((\s+.*?$)|$)/, '')
          .replace(/\s+as\s+/gi, ' ')
          .trim(),
      ),
    ]
    const tableList: Array<{
      tableName: string
      tableAlia: string
    }> = []

    strList.forEach((tableAndAlia) => {
      tableAndAlia.split(',').forEach((item) => {
        const [tableName, tableAlia] = item.trim().split(/\s+/)

        if (!tableName) return

        tableList.push({
          tableName,
          tableAlia: tableAlia || tableName,
        })
      })
    })

    return tableList
  }

  private createFieldSuggestion(fieldOption: FieldOption): SuggestOption {
    return {
      label: fieldOption.fieldName || '',
      kind: this.monaco.languages.CompletionItemKind.Field,
      detail: `<字段> ${fieldOption.fieldComment || ''} <${fieldOption.fieldType || fieldOption.fieldName}>`,
      sortText: this.sortText.Column,
      insertText: fieldOption.fieldName || '',
      documentation: {
        value: `
### 数据库: ${fieldOption.databaseName}
### 表: ${fieldOption.tableName}
### 注释: ${fieldOption.fieldComment || ''}`,
      },
    }
  }
}
