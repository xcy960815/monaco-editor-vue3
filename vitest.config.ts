import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'

const stub = (relativePath: string) =>
  fileURLToPath(new URL(relativePath, import.meta.url))

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
  },
  resolve: {
    alias: [
      {
        find: 'monaco-editor/esm/vs/basic-languages/sql/sql.js',
        replacement: stub('./tests/stubs/sql-language.ts'),
      },
      {
        find: /^monaco-editor$/,
        replacement: stub('./tests/stubs/monaco-editor.ts'),
      },
    ],
  },
})
