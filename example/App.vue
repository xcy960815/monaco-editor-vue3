<template>
  <h2 align="center">monaco-editor for vue3</h2>
  <el-form class="config-buttons" inline>
    <el-form-item label="编译器高度">
      <el-button @click="monacaEditorHeight += 100">
        编译器 高度增加100px
      </el-button>
    </el-form-item>
    <el-form-item label="编译器高度">
      <el-button @click="monacaEditorHeight -= 100">
        编译器 高度减少100px
      </el-button>
    </el-form-item>
    <el-form-item label="编译器宽度">
      <el-button @click="monacaEditorWidth += 100">
        编译器 宽度增加100px
      </el-button>
    </el-form-item>
    <el-form-item label="编译器宽度">
      <el-button @click="monacaEditorWidth -= 100">
        编译器 宽度减少100px
      </el-button>
    </el-form-item>
    <el-form-item label="编译器主题">
      <el-select v-model="monacoEditorTheme" placeholder="请选择编译器主题">
        <el-option label="vs-dark" value="vs-dark"></el-option>
        <el-option label="hc-black" value="hc-black"></el-option>
        <el-option label="vs" value="vs"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="编译器特殊用法">
      <el-button @click="dialogVisible = true">
        通过dialog 弹出编辑器
      </el-button>
    </el-form-item>
  </el-form>

  <MonacoEditor
    :width="monacaEditorWidth"
    :height="monacaEditorHeight"
    v-model="defaultSql"
    :monacoEditorTheme="monacoEditorTheme"
    :customKeywords="customKeywords"
    :databaseOptions="databaseOptionsState.databaseOptions"
  ></MonacoEditor>

  <el-dialog
    v-model="dialogVisible"
    title="monaco-editor 在dialog中"
    width="50%"
  >
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
import MonacoEditor from "vue3-monaco-editor";

import { ref, reactive, onMounted } from "vue";

// DatabaseOption 自定义提示 数据库.表名.字段名的数据格式
import type { DatabaseOption } from "vue3-monaco-editor";
// 编译器高度
const monacaEditorHeight = ref<number>(300);

// 编译器宽度
const monacaEditorWidth = ref<number>(500);

// 测试sql
const defaultSql = `select * from dual
  where name = "小明"
  limit 100`;

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

<style lang="less" scoped></style>
