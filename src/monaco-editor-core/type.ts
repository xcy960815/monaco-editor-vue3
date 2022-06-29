// 声明
import * as monaco from "monaco-editor"

// 建议选项
export type SuggestOption = monaco.languages.CompletionItem

// 字段选项
export type fieldOption = {
    fieldName: string
    fieldType?: string
    databaseName?: string
    tableName?: string
    commentName?: string
}

// 表选项
export type TableOption = {
    // 表名
    tableName: string
    // 表备注
    tableComment?: string
    // 字段选项
    fieldOptions: Array<fieldOption>
}

// 数据库选项
export type DatabaseOption = {
    databaseName: string
    tableOptions: Array<TableOption>
}

export type SortText = {
    Database: string
    Table: string
    Column: string
    Keyword: string
}