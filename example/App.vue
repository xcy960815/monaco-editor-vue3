<template>
  <MonacoEditor
    :height="monacaEditorHeight"
    v-model="defaultSql"
    :monacoEditorTheme="monacoEditorTheme"
    :customKeywords="customKeywords"
    :databaseOptions="databaseOptionsState.databaseOptions"
  ></MonacoEditor>

  <div class="config-buttons">
    <el-button class="config-el-button" @click="monacaEditorHeight += 100">
      编译器 高度增加100px
    </el-button>
    <el-button class="config-el-button" @click="monacaEditorHeight -= 100">
      编译器 高度减少100px
    </el-button>
    <el-button class="config-el-button" @click="handleSetEditorTheme('vs')">
      编译器 主题 vs
    </el-button>
    <el-button
      class="config-el-button"
      @click="handleSetEditorTheme('vs-dark')"
    >
      编译器 主题 vs-dark
    </el-button>
    <el-button
      class="config-el-button"
      @click="handleSetEditorTheme('hc-black')"
    >
      编译器 主题 hc-black
    </el-button>
    <el-button @click="dialogVisible = true"> 通过dialog 弹出编辑器 </el-button>
  </div>

  <el-dialog v-model="dialogVisible" title="Tips" width="30%">
    <MonacoEditor
      ref="dialogMonacoEditor"
      :height="monacaEditorHeight"
      v-model="dialogSql"
      :monacoEditorTheme="monacoEditorTheme"
      :customKeywords="customKeywords"
      :databaseOptions="databaseOptionsState.databaseOptions"
    ></MonacoEditor>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// 在单独的.vue文件里面引用 在setup语法糖引入的组件无需再conponents属性里面注册 直接使用就行了
import MonacoEditor from "vue3-monaco-editor";

import { ref, reactive, onMounted } from "vue";

// DatabaseOption 自定义提示 数据库.表名.字段名的数据格式
import type { DatabaseOption, ThemeType } from "vue3-monaco-editor";
// 编译器高度
const monacaEditorHeight = ref<number>(300);
console.log("MonacoEditor", MonacoEditor);

// 测试sql
const defaultSql = `select * from dual
where name = "小明"
limit 100

select`;

// dialog sql
const dialogSql = ``;
const monacoEditor = ref<InstanceType<typeof MonacoEditor>>();
// 自定义提示 (不建议使用 提示不够完整 后期加强)
const customKeywords = ["test1", "test2"];

// 编译器主题
const monacoEditorTheme = ref("vs-dark");

// 模拟的数据库数据 包含 库名表明 (暂时不建议使用 后期会加强一下)
const databaseOptionsState = reactive<{
  databaseOptions: Array<DatabaseOption>;
}>({
  databaseOptions: [],
});

const dialogVisible = ref(false);

// 变更编译器主题
const handleSetEditorTheme = (theme: ThemeType) =>
  (monacoEditorTheme.value = theme);

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
            },
          ],
        },
      ],
    });
  }
};

onMounted(() => {
  initDatabaseOptions();
});
</script>

<style lang="less" scoped>
.config-buttons {
  margin-top: 20px;
  margin-bottom: 20px;
  .config-el-button {
    margin-right: 10px;
  }
}
</style>
