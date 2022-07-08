import { Plugin } from "vue";
import { TableOption, FieldOption, DatabaseOption, ThemeType, SortText, SuggestOption, Monaco } from "./type";
declare const MonacoEditorComponent: {
    new (...args: any[]): any;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{}>>, {}, any, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin;
export { TableOption, FieldOption, DatabaseOption, ThemeType, SortText, SuggestOption, Monaco };
export default MonacoEditorComponent;
