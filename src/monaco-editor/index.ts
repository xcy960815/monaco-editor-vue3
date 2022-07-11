
import MonacoEditor from "./index.vue";

import { App, Plugin } from "vue";

import { TableOption, FieldOption, DatabaseOption, ThemeType, SortText, SuggestOption, Monaco } from "./type"

const MonacoEditorComponent = MonacoEditor as typeof MonacoEditor & Plugin

MonacoEditor.install = (app: App): void => {
    app.component(MonacoEditor.name, MonacoEditor);
}

export {
    TableOption,
    FieldOption,
    DatabaseOption,
    ThemeType,
    SortText,
    SuggestOption,
    Monaco
}

export default MonacoEditorComponent;


