import * as monaco from 'monaco-editor';
import type { DatabaseOption, SortText, SuggestOption, Monaco } from "./type";
export default class SqlSnippets {
    monaco: Monaco;
    customKeywords: Array<string>;
    databaseKeywords: Array<string>;
    databaseOptions: Array<DatabaseOption>;
    sortText: SortText;
    constructor(customKeywords?: Array<string>, databaseOptions?: Array<DatabaseOption>);
    setDatabaseOption(databaseOptions: Array<DatabaseOption>): void;
    getTextByCursorPosition: (model: monaco.editor.ITextModel, position: monaco.Position) => {
        textBeforePointer: string;
        textBeforePointerMulti: string;
        textAfterPointer: string;
        textAfterPointerMulti: string;
    };
    provideCompletionItems(model: monaco.editor.ITextModel, position: monaco.Position): Promise<{
        suggestions: SuggestOption[];
    }>;
    getCustomSuggestions(startsWith$: boolean): Array<SuggestOption>;
    getDataBaseOptionsSuggestions: () => Array<SuggestOption>;
    getKeywordOptionsSuggestions: () => Array<SuggestOption>;
    getTableOptionsSuggestions: () => Array<SuggestOption>;
    getTableOptionsSuggestByDatabaseName: (databaseName: string) => Array<SuggestOption>;
    getFieldOptionsSuggestions: () => Array<SuggestOption>;
    getFieldOptionsSuggestByTableAlia: () => Array<SuggestOption>;
    getTableNameAndTableAlia: (sqlText: string) => Array<{
        tableName: string;
        tableAlia: string;
    }>;
}
