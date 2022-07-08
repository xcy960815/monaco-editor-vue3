<template>
  <monaco-editor 
:height="monacaEditorHeight" 
v-model="defaultSql" 
:monacoEditorTheme="monacoEditorTheme"
:customKeywords="customKeywords" 
:databaseOptions="databaseOptionsState.databaseOptions"
>
  </monaco-editor>
  <!-- 测试编辑器的其他属性 -->
  <div style="margin-top:20px;margin-bottom: 20px;">
<button class="config-button" @click="monacaEditorHeight += 100">编译器 高度增加100px </button>
<button class="config-button" @click="monacaEditorHeight -= 100">编译器 高度减少100px </button>
<button class="config-button" @click="handleSetEditorTheme('vs')">编译器 主题 vs </button>
<button class="config-button" @click="handleSetEditorTheme('vs-dark')">编译器 主题 vs-dark </button>
<button class="config-button" @click="handleSetEditorTheme('hc-black')">编译器 主题 hc-black </button>
  </div>
</template>

<script lang="ts" setup>
// 在单独的.vue文件里面引用 在setup语法糖引入的组件无需再conponents属性里面注册 直接使用就行了
import MonacoEditor from "vue3-monaco-editor"


import { ref, reactive, onMounted } from "vue"
// DatabaseOption 自定义提示 数据库.表名.字段名的数据格式
import type { DatabaseOption, ThemeType } from "vue3-monaco-editor"

// 编译器高度
const monacaEditorHeight = ref<number>(300)

// 测试sql
const defaultSql = `select * from dual
where name = "小明"
limit 100

select _name as name,_age as age from <database>.<table>`

// 自定义提示 (不建议使用 提示不够完整 后期加强)
const customKeywords = ["test1", "test2"]

// 编译器主题
const monacoEditorTheme = ref("vs-dark")

// 模拟的数据库数据 包含 库名表明 (暂时不建议使用 后期会加强一下)
const databaseOptionsState = reactive<{ databaseOptions: Array<DatabaseOption> }>({
  databaseOptions: []
})

// 变更编译器主题
const handleSetEditorTheme = (theme: ThemeType) => monacoEditorTheme.value = theme

// 给database mock数据
const initDatabaseOptions = () => {
  for (let index = 1; index <= 1000; index++) {
databaseOptionsState.databaseOptions.push({
  databaseName: `databaseName${index}`,
  tableOptions: [
    {
      tableName: `tableName1`,
      tableComment: "tableComment1",
      fieldOptions: [
        {
          fieldName: "fieldName1",
          fieldComment: "fieldComment1",
          fieldType: "string",
          tableName: "tableName1",
          databaseName: `databaseName${index}`,
        },
        {
          fieldName: "fieldName2",
          fieldComment: "fieldComment2",
          fieldType: "string",
          tableName: "tableName1",
          databaseName: `databaseName${index}`,
        },
        {
          fieldName: "fieldName3",
          fieldComment: "fieldComment3",
          fieldType: "string",
          tableName: "tableName1",
          databaseName: `databaseName${index}`,
        }
      ]
    }
  ]
})
  }
}

onMounted(() => {
  initDatabaseOptions()
})

</script>

<style scoped>
.config-button {
  margin-right: 10px;
}
</style>