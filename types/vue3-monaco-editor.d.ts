import { AllowedComponentProps } from 'vue';
import { ComponentCustomProperties } from 'vue';
import { ComponentCustomProps } from 'vue';
import { ComponentInternalInstance } from 'vue';
import { ComponentOptionsBase } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { ComponentPublicInstance } from 'vue';
import { ComputedOptions } from 'vue';
import { DebuggerEvent } from 'vue';
import { MethodOptions } from 'vue';
import * as monaco from 'monaco-editor';
import { nextTick } from 'vue';
import { Plugin as Plugin_2 } from 'vue';
import { ShallowUnwrapRef } from 'vue';
import { Slot } from 'vue';
import { VNodeProps } from 'vue';
import { WatchOptions } from 'vue';
import { WatchStopHandle } from 'vue';

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
    new (...args: any[]): {
        $: ComponentInternalInstance;
        $data: {
            resetEditor: Function;
        };
        $props: Partial<{}> & Omit<Readonly<{
            readonly modelValue: string;
            readonly height: number;
            readonly width: number;
        }> & VNodeProps & AllowedComponentProps & ComponentCustomProps, never>;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: Slot;
        }>;
        $root: ComponentPublicInstance<    {}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>;
        $parent: ComponentPublicInstance<    {}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>;
        $emit: (event: string, ...args: any[]) => void;
        $el: any;
        $options: ComponentOptionsBase<Readonly<{
        readonly modelValue: string;
        readonly height: number;
        readonly width: number;
        }>, {}, {
        resetEditor: Function;
        }, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, {}> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: DebuggerEvent) => void) | ((e: DebuggerEvent) => void)[];
            renderTriggered?: ((e: DebuggerEvent) => void) | ((e: DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: ComponentPublicInstance<    {}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>, info: string) => boolean | void) | ((err: unknown, instance: ComponentPublicInstance<    {}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: nextTick;
        $watch(source: string | Function, cb: Function, options?: WatchOptions<boolean>): WatchStopHandle;
    } & Readonly<{
        readonly modelValue: string;
        readonly height: number;
        readonly width: number;
    }> & ShallowUnwrapRef<    {}> & {
        resetEditor: Function;
    } & {
        [x: string]: never;
    } & MethodOptions & ComponentCustomProperties;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & ComponentOptionsBase<Readonly<{
readonly modelValue: string;
readonly height: number;
readonly width: number;
}>, {}, {
resetEditor: Function;
}, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, {}> & VNodeProps & AllowedComponentProps & ComponentCustomProps & Plugin_2;
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
