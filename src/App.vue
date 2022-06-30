<template>
    <monaca-editor :height="monacaEditorHeight" v-model="defaultSql" :monacoEditorTheme="monacoEditorTheme"
        :customKeywords="customKeywords" :databaseOptions="databaseOptionsState.databaseOptions">
    </monaca-editor>
    <div style="margin-top:20px;margin-bottom: 20px;">
        <button class="config-button" @click="monacaEditorHeight += 100">编译器 高度增加 </button>
        <button class="config-button" @click="handleSetEditorTheme('vs')">编译器 主题 vs </button>
        <button class="config-button" @click="handleSetEditorTheme('vs-dark')">编译器 主题 vs-dark </button>
        <button class="config-button" @click="handleSetEditorTheme('hc-black')">编译器 主题 hc-black </button>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import MonacaEditor from "@/monaco-editor/index.vue"
import { ThemeType, DatabaseOption } from "@/monaco-editor-core/type"
// 编译器高度
const monacaEditorHeight = ref<number>(300)

// 测试sql
const defaultSql = `select * from dual
where id = "123"
limit abs accessible acos add aes_decrypt acos abs text

select * from db_bar.user

select `

const customKeywords = ["xuchongyu", "woaiwoajia"]

// 编译器主题
const monacoEditorTheme = ref<ThemeType>("vs-dark")

// 模拟的数据库数据 包含 库名表明
const databaseOptionsState = reactive<{ databaseOptions: Array<DatabaseOption> }>({
    databaseOptions: [
        {
            databaseName: 'db_bar',
            tableOptions: [
                {
                    tableName: 'user',
                    tableComment: "我是表备注我是表备注我是表备注我是表备注我是表备注我是表备注我是表备注我是表备注我是表备注我是表备注我是表备注我是表备注我是表备注我是表备注我是表备注",
                    fieldOptions: [
                        {
                            fieldName: 'userfieldName',
                            fieldComment: "字段备注",
                            fieldType: "123",
                            tableName: "user",
                            databaseName: "db_bar"
                        }
                    ]
                },
                {
                    tableName: 'log',
                    tableComment: "log表备注",
                    fieldOptions: [
                        {
                            fieldName: 'logfieldName',
                            fieldComment: "log字段备注",
                            fieldType: "123",
                            tableName: "log",
                            databaseName: "db_bar"
                        }
                    ]
                },
                {
                    tableName: 'goods',
                    tableComment: "goods表备注",
                    fieldOptions: [
                        {
                            fieldName: 'goodsfieldName',
                            fieldComment: "goods字段备注",
                            fieldType: "123",
                            tableName: "goods",
                            databaseName: "db_bar"
                        }
                    ]
                }
            ]
        },
        {
            databaseName: 'db_foo',
            tableOptions: [
                {
                    tableName: 'price',
                    tableComment: "price表备注",
                    fieldOptions: []
                },
                {
                    tableName: 'time',
                    tableComment: "time表备注",
                    fieldOptions: []
                },
                {
                    tableName: 'updata_user',
                    tableComment: "updata_user表备注",
                    fieldOptions: []
                }
            ]
        }
    ]
})

// 变更编译器主题
const handleSetEditorTheme = (theme: ThemeType) => monacoEditorTheme.value = theme
</script>

<style scoped>
.config-button {
    margin-right: 10px;
}
</style>
