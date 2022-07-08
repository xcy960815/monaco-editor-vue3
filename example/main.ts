
import { createApp } from "vue";
import App from "./App.vue";
import Vue3MonacoEditor from "vue3-monaco-editor"

const app = createApp(App)
app.use(Vue3MonacoEditor)
app.mount("#app");