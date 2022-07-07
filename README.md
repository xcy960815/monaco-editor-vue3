# vue3-monaco-editor

### monaco-editor for vue3



### 温馨提示
目前只是将微软的monaco-editor 继承到了 vue3里面 只是做了一些简单sql的展示以及数据数的双向绑定，还有部分的sql关键字提示，未来如果时间允许还有很多的功能要加




#### 安装
```shell
npm install vue3-monaco-editor -S
```

#### 使用
```ts

// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import MonacoEditor from "vue3-monaco-editor"
const app = createApp(App)
app.use(MonacoEditor)
app.mount('#app')

```
OR

```ts

<script lang="ts" setup>
// 在单独的.vue文件里面引用 在setup语法糖引入的组件无需再conponents属性里面注册 直接使用就行了
import MonacoEditor from "vue3-monaco-editor"

<script

```
OR

```ts
// 普通的vue3语法
<script lang="ts">
import MonacoEditor from "vue3-monaco-editor"
import { defineComponent } from "vue"
export default defineComponent({
  components: { MonacoEditor },
 }) 
<script

```


### .vue文件里面的使用方法 以及 使用参数
### template
```html
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

```


```ts
// 组件声明枚举 详见node_modules/vue3-monaco-editor/types/vue3-monaco-editor.d.ts 文件

import * as monaco from "monaco-editor"

export interface Monaco {
languages: typeof monaco.languages
}

// 列选项
export type FieldOption = {
fieldName: string // 字段名称
fieldType: string // 字段类型
fieldComment: string //字段注释
databaseName: string // 数据库名称
tableName: string // 表名

}

// 表选项
export type TableOption = {
tableName: string //表名
tableComment: string //表备注
fieldOptions: Array<FieldOption>
}

// 数据库选项
export type DatabaseOption = {
databaseName: string
tableOptions: Array<TableOption>
}

export type SortText = {
Database: "0"
Table: "1"
Column: "2"
Keyword: "3"
}

// 重写建议声明
export interface SuggestOption
extends Pick<
monaco.languages.CompletionItem,
Exclude<keyof monaco.languages.CompletionItem, 'range'>
> {
range?: monaco.IRange | {
    insert: monaco.IRange;
    replace: monaco.IRange;
};
}

/**
 * 编译器主题枚举
 */
export type ThemeType = "vs" | "vs-dark" | 'hc-black'


```

### 未来 TODO
1. 支持库名.表明.字段的智能提示
2. 自定义关键字的提示
3. ...

### 如果您有更好的建议 可以联系 [我](18763006837@163.com)，让该组件变的更好

### 免责声明

本包是自己用业余时间封装打包的，如若您使用了该包，出现问题不负责任