import { AllowedComponentProps } from 'vue';
import { ComponentCustomProps } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { DefineComponent } from 'vue';
import { ExtractPropTypes } from 'vue';
import * as monaco from 'monaco-editor';
import type { PropType } from 'vue';
import { RendererElement } from 'vue';
import { RendererNode } from 'vue';
import { VNode } from 'vue';
import { VNodeProps } from 'vue';

declare type DatabaseOption = {
    databaseName: string;
    tableOptions: Array<TableOption>;
};

declare const _default: DefineComponent<    {
modelValue: {
type: StringConstructor;
default: () => string;
};
triggerCharacters: {
type: PropType<string[]>;
default: () => any[];
};
customKeywords: {
type: PropType<string[]>;
default: () => any[];
};
databaseOptions: {
type: PropType<DatabaseOption[]>;
default: () => any[];
};
width: {
type: NumberConstructor;
default: () => number;
};
height: {
type: NumberConstructor;
default: () => number;
};
monacoEditorOption: {
type: PropType<monaco.editor.IStandaloneEditorConstructionOptions>;
default: {};
};
monacoEditorTheme: {
type: PropType<ThemeType>;
default: string;
};
}, (_ctx: any, _cache: any) => VNode<RendererNode, RendererElement, {
[key: string]: any;
}>, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<    {
modelValue: {
type: StringConstructor;
default: () => string;
};
triggerCharacters: {
type: PropType<string[]>;
default: () => any[];
};
customKeywords: {
type: PropType<string[]>;
default: () => any[];
};
databaseOptions: {
type: PropType<DatabaseOption[]>;
default: () => any[];
};
width: {
type: NumberConstructor;
default: () => number;
};
height: {
type: NumberConstructor;
default: () => number;
};
monacoEditorOption: {
type: PropType<monaco.editor.IStandaloneEditorConstructionOptions>;
default: {};
};
monacoEditorTheme: {
type: PropType<ThemeType>;
default: string;
};
}>> & {
"onUpdate:modelValue"?: (...args: any[]) => any;
}, {
modelValue: string;
triggerCharacters: string[];
customKeywords: string[];
databaseOptions: DatabaseOption[];
width: number;
height: number;
monacoEditorOption: {};
monacoEditorTheme: ThemeType;
}>;
export default _default;

declare type FieldOption = {
    fieldName: string;
    fieldType: string;
    fieldComment: string;
    databaseName: string;
    tableName: string;
};

declare type TableOption = {
    tableName: string;
    tableComment: string;
    fieldOptions: Array<FieldOption>;
};

declare type ThemeType = "vs" | "vs-dark" | 'hc-black';

export { }
