import { createApp } from 'vue'
import App from './App.vue'
import * as monacoEditor from "@/monaco-editor"
const app = createApp(App)
app.use(monacoEditor)
app.mount('#app')
