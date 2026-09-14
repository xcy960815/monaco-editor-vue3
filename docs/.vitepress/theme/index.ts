import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { defineAsyncComponent } from 'vue'

import '../../../src/style.css'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component(
      'MonacoEditor',
      defineAsyncComponent(() =>
        import('../../../src/components').then((module) => module.MonacoEditor),
      ),
    )
    app.component(
      'AppDemo',
      defineAsyncComponent(() => import('../../../src/App.vue')),
    )
  },
} satisfies Theme
