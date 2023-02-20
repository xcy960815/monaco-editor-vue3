import { AllowedComponentProps } from 'vue';
import { ComponentCustomProps } from 'vue';
import { ComponentOptionsBase } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { ComputedOptions } from 'vue';
import { MethodOptions } from 'vue';
import * as monaco from 'monaco-editor';
import { Plugin as Plugin_2 } from 'vue';
import { VNodeProps } from 'vue';

export declare type DatabaseOption = {
    databaseName: string;
    tableOptions: Array<TableOption>;
};

export declare type FieldOption = {
    fieldName: string;
    fieldType: string;
    fieldComment: string;
    databaseName: string;
    tableName: string;
};

export declare interface Monaco {
    languages: typeof monaco.languages;
}

declare const MonacoEditorComponent: {
    new (...args: any[]): any;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & ComponentOptionsBase<Readonly<{} & {} & {}>, {}, any, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, {}> & VNodeProps & AllowedComponentProps & ComponentCustomProps & Plugin_2;
export default MonacoEditorComponent;

export declare type SortText = {
    Database: "0";
    Table: "1";
    Column: "2";
    Keyword: "3";
};

export declare interface SuggestOption extends Pick<monaco.languages.CompletionItem, Exclude<keyof monaco.languages.CompletionItem, 'range'>> {
    range?: monaco.IRange | {
        insert: monaco.IRange;
        replace: monaco.IRange;
    };
}

export declare type TableOption = {
    tableName: string;
    tableComment: string;
    fieldOptions: Array<FieldOption>;
};

export declare type ThemeType = "vs" | "vs-dark" | 'hc-black';

export { }
