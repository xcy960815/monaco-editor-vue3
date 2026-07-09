import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const sharedGlobals = {
  ...globals.browser,
  ...globals.node,
}

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'types/**', '.husky/**'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: sharedGlobals,
    },
  },
  {
    files: ['rollup.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,d.ts}'],
    languageOptions: {
      ...config.languageOptions,
      globals: sharedGlobals,
    },
  })),
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: sharedGlobals,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/one-component-per-file': 'off',
    },
  },
  {
    files: ['**/*.{ts,d.ts}'],
    rules: {
      '@typescript-eslint/no-this-alias': 'off',
      'vue/one-component-per-file': 'off',
    },
  },
  prettierConfig,
]
