
import type { App } from "vue"
import MonacoEditor from "./index.vue"
MonacoEditor.install = (app: App): void => {
    app.component(MonacoEditor.name, MonacoEditor)
    MonacoEditor.installed = true
}


export default MonacoEditor




