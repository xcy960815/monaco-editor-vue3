import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { defineAsyncComponent } from 'vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component(
      'AppDemo',
      defineAsyncComponent(() => import('../../../src/App.vue')),
    )
  },
} satisfies Theme
