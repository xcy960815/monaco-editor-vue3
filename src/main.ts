import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import * as monacoEditor from "@/monaco-editor/index"
// import * as monacoEditor from "./dist/monaco-editor.umd.js"
const app = createApp(App)
app.use(monacoEditor)
app.mount('#app')
