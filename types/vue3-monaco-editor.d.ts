import { DefineComponent, Plugin } from 'vue';
import * as monaco from 'monaco-editor';

interface Monaco {
    languages: typeof monaco.languages;
}
type FieldOption = {
    fieldName: string;
    fieldType: string;
    fieldComment: string;
    databaseName: string;
    tableName: string;
};
type TableOption = {
    tableName: string;
    tableComment: string;
    fieldOptions: Array<FieldOption>;
};
type DatabaseOption = {
    databaseName: string;
    tableOptions: Array<TableOption>;
};
type SortText = {
    Database: '0';
    Table: '1';
    Column: '2';
    Keyword: '3';
};
interface SuggestOption extends Pick<monaco.languages.CompletionItem, Exclude<keyof monaco.languages.CompletionItem, 'range'>> {
    range?: monaco.IRange | {
        insert: monaco.IRange;
        replace: monaco.IRange;
    };
}
type ThemeType = 'vs' | 'vs-dark' | 'hc-black';

type MonacoEditorProps = {
    modelValue?: string;
    triggerCharacters?: string[];
    customKeywords?: string[];
    databaseOptions?: DatabaseOption[];
    width?: number | string;
    height?: number | string;
    monacoEditorOption?: monaco.editor.IStandaloneEditorConstructionOptions;
    monacoEditorTheme?: ThemeType;
};
type MonacoEditorExpose = {
    initEditor: () => void;
    resetEditor: () => void;
    insertText: (text: string) => void;
    getSelectedText: () => string;
    replaceSelectedText: (text: string) => boolean;
    replaceText: (text: string) => void;
};
type MonacoEditorComponent = DefineComponent<MonacoEditorProps, MonacoEditorExpose>;
declare const MonacoEditor: MonacoEditorComponent;
declare const MonacoEditorPlugin: typeof MonacoEditor & Plugin;

export { MonacoEditor, MonacoEditorPlugin as default };
export type { DatabaseOption, FieldOption, Monaco, MonacoEditorComponent, MonacoEditorExpose, MonacoEditorProps, SortText, SuggestOption, TableOption, ThemeType };
