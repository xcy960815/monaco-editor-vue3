import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/index.ts'),
      name: 'Vue3MonacoEditor',
      formats: ['es', 'umd'],
      fileName: (format: string) => {
        if (format === 'es') return 'vue3-monaco-editor.es.js'
        return 'vue3-monaco-editor.umd.js'
      },
    },
    rollupOptions: {
      external: [
        'vue',
        'monaco-editor',
        'monaco-editor/esm/vs/basic-languages/sql/sql.js',
        'monaco-editor/esm/vs/editor/contrib/find/findController',
        'monaco-editor/esm/vs/editor/contrib/hover/hover',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'monaco-editor': 'monaco',
          'monaco-editor/esm/vs/basic-languages/sql/sql.js': 'monaco',
          'monaco-editor/esm/vs/editor/contrib/find/findController': 'monaco',
          'monaco-editor/esm/vs/editor/contrib/hover/hover': 'monaco',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'vue3-monaco-editor.css'
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})
