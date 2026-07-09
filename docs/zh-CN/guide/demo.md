# 示例

```vue
<template>
  <MonacoEditor v-model="sql" :height="320" monaco-editor-theme="vs-dark" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MonacoEditor } from 'vue3-monaco-editor'

const sql = ref('select * from databaseName1.tableName1')
</script>
```
