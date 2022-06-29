
import * as monaco from "monaco-editor"


// 列选项
export type FieldOption = {
    fieldName: string // 字段名称
    fieldType: string // 字段类型
    fieldComment: string //字段注释
    databaseName: string // 数据库名称
    tableName: string // 表名

}

// 表选项
export type TableOption = {
    tableName: string //表名
    tableComment: string //表备注
    fieldOptions: Array<FieldOption>
}

// 数据库选项
export type DatabaseOption = {
    databaseName: string
    tableOptions: Array<TableOption>
}

export type SortText = {
    Database: "0"
    Table: "1"
    Column: "2"
    Keyword: "3"
}

// 重写建议选项
export interface SuggestOption
    extends Pick<
    monaco.languages.CompletionItem,
    Exclude<keyof monaco.languages.CompletionItem, 'range'>
    > {
    range?: monaco.IRange | {
        insert: monaco.IRange;
        replace: monaco.IRange;
    };
}


export type ThemeType = "vs" | "vs-dark"
