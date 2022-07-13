
import * as monaco from "monaco-editor"

export interface Monaco {
    // CancellationTokenSource: typeof monaco.CancellationTokenSource
    // Emitter: typeof monaco.Emitter<any>
    // KeyCode: typeof monaco.KeyCode
    // KeyMod: typeof monaco.KeyMod
    // MarkerSeverity: typeof monaco.MarkerSeverity
    // MarkerTag: typeof monaco.MarkerTag
    // Position: typeof monaco.Position
    // Range: typeof monaco.Range
    // Selection: typeof monaco.Selection
    // SelectionDirection: typeof monaco.SelectionDirection
    // Token: typeof monaco.Token
    // Uri: typeof monaco.Uri
    // editor: typeof monaco.editor
    languages: typeof monaco.languages
}

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

// 重写monaco-editor建议声明
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

/**
 * 编译器主题枚举
 */
export type ThemeType = "vs" | "vs-dark" | 'hc-black'
