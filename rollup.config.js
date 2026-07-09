const fs = require('fs')
const path = require('path')
const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve')
const postcss = require('rollup-plugin-postcss')
const typescript = require('@rollup/plugin-typescript')
const { dts } = require('rollup-plugin-dts')
const terser = require('@rollup/plugin-terser')

const input = path.resolve(__dirname, 'src/components/index.ts')
const distDir = path.resolve(__dirname, 'dist')
const typesDir = path.resolve(__dirname, 'types')
const tempDir = path.join(distDir, 'temp')
const tempTypesInput = path.join(tempDir, 'components/index.d.ts')
const external = [
  'vue',
  'monaco-editor',
  'monaco-editor/esm/vs/basic-languages/sql/sql.js',
  'monaco-editor/esm/vs/editor/contrib/find/findController',
  'monaco-editor/esm/vs/editor/contrib/hover/hover',
]

fs.rmSync(distDir, { recursive: true, force: true })
fs.rmSync(typesDir, { recursive: true, force: true })
fs.rmSync(tempDir, { recursive: true, force: true })
fs.mkdirSync(distDir, { recursive: true })
fs.mkdirSync(typesDir, { recursive: true })

module.exports = [
  {
    input,
    external,
    output: [
      {
        file: path.join(distDir, 'vue3-monaco-editor.es.js'),
        format: 'es',
      },
      {
        file: path.join(distDir, 'vue3-monaco-editor.umd.js'),
        format: 'umd',
        exports: 'named',
        name: 'Vue3MonacoEditor',
        globals: {
          vue: 'Vue',
          'monaco-editor': 'monaco',
          'monaco-editor/esm/vs/basic-languages/sql/sql.js': 'monaco',
          'monaco-editor/esm/vs/editor/contrib/find/findController': 'monaco',
          'monaco-editor/esm/vs/editor/contrib/hover/hover': 'monaco',
        },
      },
      {
        file: path.join(distDir, 'vue3-monaco-editor.umd.min.js'),
        format: 'umd',
        exports: 'named',
        name: 'Vue3MonacoEditor',
        globals: {
          vue: 'Vue',
          'monaco-editor': 'monaco',
          'monaco-editor/esm/vs/basic-languages/sql/sql.js': 'monaco',
          'monaco-editor/esm/vs/editor/contrib/find/findController': 'monaco',
          'monaco-editor/esm/vs/editor/contrib/hover/hover': 'monaco',
        },
        plugins: [terser()],
      },
    ],
    plugins: [
      resolve.nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      postcss({
        extract: path.join(distDir, 'vue3-monaco-editor.css'),
        minimize: true,
      }),
      typescript({
        tsconfig: './tsconfig.rollup.json',
      }),
    ],
  },
  {
    input: tempTypesInput,
    output: [
      {
        file: path.join(typesDir, 'vue3-monaco-editor.d.ts'),
        format: 'es',
      },
    ],
    external: [/\.css$/, ...external],
    plugins: [
      dts({
        tsconfig: './tsconfig.rollup.json',
      }),
      {
        name: 'clean-temp-types',
        closeBundle() {
          fs.rmSync(tempDir, { recursive: true, force: true })
        },
      },
    ],
  },
]
