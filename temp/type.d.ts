import * as monaco from "monaco-editor";
export interface Monaco {
    languages: typeof monaco.languages;
}
export declare type FieldOption = {
    fieldName: string;
    fieldType: string;
    fieldComment: string;
    databaseName: string;
    tableName: string;
};
export declare type TableOption = {
    tableName: string;
    tableComment: string;
    fieldOptions: Array<FieldOption>;
};
export declare type DatabaseOption = {
    databaseName: string;
    tableOptions: Array<TableOption>;
};
export declare type SortText = {
    Database: "0";
    Table: "1";
    Column: "2";
    Keyword: "3";
};
export interface SuggestOption extends Pick<monaco.languages.CompletionItem, Exclude<keyof monaco.languages.CompletionItem, 'range'>> {
    range?: monaco.IRange | {
        insert: monaco.IRange;
        replace: monaco.IRange;
    };
}
export declare type ThemeType = "vs" | "vs-dark" | 'hc-black';
