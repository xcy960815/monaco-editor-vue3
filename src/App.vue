<template>
  <main class="demo-page">
    <section class="demo-toolbar">
      <label class="demo-field">
        <span>Height</span>
        <input
          v-model.number="monacoEditorHeight"
          min="160"
          step="20"
          type="number"
        />
      </label>
      <label class="demo-field">
        <span>Width</span>
        <input
          v-model.number="monacoEditorWidth"
          min="0"
          step="20"
          type="number"
        />
      </label>
      <label class="demo-field">
        <span>Theme</span>
        <select v-model="monacoEditorTheme">
          <option value="vs">vs</option>
          <option value="vs-dark">vs-dark</option>
          <option value="hc-black">hc-black</option>
        </select>
      </label>
      <button type="button" @click="handleReset">Reset</button>
    </section>

    <MonacoEditor
      ref="monacoEditorRef"
      v-model="defaultSql"
      :custom-keywords="customKeywords"
      :database-options="databaseOptions"
      :height="monacoEditorHeight"
      :monaco-editor-theme="monacoEditorTheme"
      :width="monacoEditorWidth"
    />
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { MonacoEditor } from './components'
import type { DatabaseOption, ThemeType } from './components'

type MonacoEditorExpose = {
  resetEditor: () => void
}

const monacoEditorHeight = ref<number>(320)
const monacoEditorWidth = ref<number>(0)
const monacoEditorTheme = ref<ThemeType>('vs-dark')
const monacoEditorRef = ref<MonacoEditorExpose | null>(null)
const defaultSql = ref(`select *
from databaseName1.tableName1 t
where t.fieldName1 = "小明"
limit 100`)
const customKeywords = ['test1', 'test2']
const databaseOptions = ref<Array<DatabaseOption>>([])

const handleReset = (): void => {
  monacoEditorRef.value?.resetEditor()
}

onMounted(() => {
  databaseOptions.value = Array.from({ length: 10 }, (_, index) => {
    const databaseIndex = index + 1

    return {
      databaseName: `databaseName${databaseIndex}`,
      tableOptions: [
        {
          tableName: 'tableName1',
          tableComment: 'tableComment1',
          fieldOptions: ['fieldName1', 'fieldName2', 'fieldName3'].map(
            (fieldName) => ({
              fieldName,
              fieldComment: `${fieldName} comment`,
              fieldType: 'string',
              tableName: 'tableName1',
              databaseName: `databaseName${databaseIndex}`,
            }),
          ),
        },
      ],
    }
  })
})
</script>

<style scoped>
.demo-page {
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  padding: 24px;
  background: #f6f7f9;
}

.demo-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: end;
  margin-bottom: 16px;
}

.demo-field {
  display: grid;
  gap: 6px;
  color: #344054;
  font-size: 13px;
}

.demo-field input,
.demo-field select,
.demo-toolbar button {
  box-sizing: border-box;
  height: 34px;
  border: 1px solid #d0d5dd;
  border-radius: 4px;
  padding: 0 10px;
  background: #ffffff;
  color: #101828;
}

.demo-toolbar button {
  cursor: pointer;
}
</style>
