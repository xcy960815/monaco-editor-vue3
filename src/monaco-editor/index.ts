
import type { App } from "vue"

import MonacoEditor from "./index.vue"

const install = (app: App) => {
    if (MonacoEditor.installed) return
    app.component(MonacoEditor.name, MonacoEditor)
    MonacoEditor.installed = true
}

export {
    MonacoEditor,
    install
}




