<template>
    <monaca-editor :height="monacaEditorHeight" v-model.sql="defaultSql"></monaca-editor>
    <button @click="monacaEditorHeight += 10">monaca-editor 高度增加 </button>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import MonacaEditor from "@/monaco-editor/index.vue"
const monacaEditorHeight = ref<number>(500)
const defaultSql = `select * from DUAL
WHERE id = "123"
LIMIT ABS ACCESSIBLE ACOS ADD AES_DECRYPT ACOS ABS TEXT`
const databaseOptionsState = reactive({
    databaseOptions: [
        {
            dbName: 'db_bar',
            tables: [
                {
                    tblName: 'user',
                    tableColumns: [
                        {
                            fieldName: 'username'
                        }
                    ]
                },
                {
                    tblName: 'log',
                    tableColumns: []
                },
                {
                    tblName: 'goods',
                    tableColumns: []
                }
            ]
        },
        {
            dbName: 'db_foo',
            tables: [
                {
                    tblName: 'price',
                    tableColumns: []
                },
                {
                    tblName: 'time',
                    tableColumns: []
                },
                {
                    tblName: 'updata_user',
                    tableColumns: []
                }
            ]
        }
    ]
})
</script>

<style>
</style>
