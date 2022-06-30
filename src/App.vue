<template>
    <monaco-editor :height="monacaEditorHeight" v-model="defaultSql" :monacoEditorTheme="monacoEditorTheme"
        :customKeywords="customKeywords" :databaseOptions="databaseOptionsState.databaseOptions">
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
import { ref, reactive, onMounted } from "vue"


import { ThemeType, DatabaseOption } from "@/monaco-editor/type"

// 编译器高度
const monacaEditorHeight = ref<number>(300)



// 测试sql
const defaultSql = `select * from dual
where id = "123"
limit abs accessible acos add aes_decrypt acos abs text

select * from db_bar.user

select`

const customKeywords = ["xuchongyu", "woaiwoajia"]

// 编译器主题
const monacoEditorTheme = ref<ThemeType>("vs-dark")

// 模拟的数据库数据 包含 库名表明
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
