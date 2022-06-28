import * as monaco from 'monaco-editor'
import { keywords } from './keywords'

// 列选项
type TableColumnOption = {
    columnName: string
    columnType: string
    databaseName: string
    tableName: string
    commentName: string
}

// 表选项
type TableOption = {
    tableName: string
    tableComment: string
    tableColumnOptions: Array<TableColumnOption>
}

// 数据库选项
export type DatabaseOption = {
    databaseName: string
    tableOptions: Array<TableOption>
}

type SortText = {
    Database: string
    Table: string
    Column: string
    Keyword: string
}

// type Option = {
//     label: string
//     kind: number
//     detail: string
//     sortText: string
//     insertText: string
//     documentation: string | { value: string }
// }

// 建议选项
type SuggestOption = any

export default class Snippets {
    monacoEditor: any

    // 自定义关键字
    customKeywords: Array<string>

    databaseKeywords: Array<string>

    databaseOptions: Array<DatabaseOption>

    sortText: SortText

    onInputTableColumn: Function | undefined

    onInputTableAila: Function | undefined

    constructor(
        customKeywords?: Array<string>,
        databaseOptions?: Array<DatabaseOption>,
        onInputTableColumn?: Function,
        onInputTableAila?: Function
    ) {
        this.sortText = {
            Database: '0',
            Table: '1',
            Column: '2',
            Keyword: '3',
        }

        // 记录自定义关键字
        this.customKeywords = customKeywords ? customKeywords : []

        // 数据库关键字
        this.databaseKeywords = [
            ...keywords,
            ...(customKeywords ? customKeywords : []),
        ]

        // 记录数据库选项
        this.databaseOptions = databaseOptions ? databaseOptions : []

        // editor 赋值
        this.monacoEditor = monaco

        // 字段联想callback
        this.onInputTableColumn = onInputTableColumn

        // <别名>.<字段>联想callback
        this.onInputTableAila = onInputTableAila
    }

    /**
     * 动态设置数据库表&&数据库字段
     * @param {*} databaseOptions 数据库数据
     * @example [{ databaseName: '', tableOptions: [{ tableName: '', tableColumnOptions: [] }] }]
     */
    setDatabaseOption(databaseOptions: Array<DatabaseOption>) {
        this.databaseOptions = databaseOptions
    }

    /**
     * monaco提示方法
     * @param {*} model
     * @param {*} position
     */
    async provideCompletionItems(model: monaco.editor.ITextModel, position: monaco.Position) {
        // 获取当前列和当前行
        const { lineNumber, column } = position

        // 光标前文本
        const textBeforePointer = model.getValueInRange({
            startLineNumber: lineNumber,
            startColumn: 0,
            endLineNumber: lineNumber,
            endColumn: column,
        })

        const textBeforePointerMulti = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 0,
            endLineNumber: lineNumber,
            endColumn: column,
        })

        // 光标后文本
        // const textAfterPointer = model.getValueInRange({
        //   startLineNumber: lineNumber,
        //   startColumn: column,
        //   endLineNumber: lineNumber,
        //   endColumn: model.getLineMaxColumn(model.getLineCount())
        // })

        const textAfterPointerMulti = model.getValueInRange({
            startLineNumber: lineNumber,
            startColumn: column,
            endLineNumber: model.getLineCount(),
            endColumn: model.getLineMaxColumn(model.getLineCount()),
        })

        // const nextTokens = textAfterPointer.trim().split(/\s+/)

        // const nextToken = nextTokens[0].toLowerCase()

        const tokens = textBeforePointer.trim().split(/\s+/)

        // 最后一个字段
        const lastToken = tokens[tokens.length - 1].toLowerCase()

        // 数据库名联想
        if (lastToken === 'database') {
            return {
                suggestions: this.getDataBaseSuggest(),
            }
            // <库名>.<表名> || <别名>.<字段>
        } else if (lastToken.endsWith('.')) {
            // 去掉点后的字符串
            const tokenNoDot = lastToken.slice(0, lastToken.length - 1)
            if (
                this.databaseOptions.find(
                    (dboption) =>
                        dboption.databaseName ===
                        tokenNoDot.replace(/^.*,/g, '')
                )
            ) {
                // <库名>.<表名>联想
                return {
                    suggestions: [
                        ...this.getTableSuggestByDbName(
                            tokenNoDot.replace(/^.*,/g, '')
                        ),
                    ],
                }
            } else if (
                this.getTableNameAndTableAlia(
                    textBeforePointerMulti.split(';')[
                    textBeforePointerMulti.split(';').length - 1
                    ] + textAfterPointerMulti.split(';')[0]
                )
            ) {
                const tableInfoList = this.getTableNameAndTableAlia(
                    textBeforePointerMulti.split(';')[
                    textBeforePointerMulti.split(';').length - 1
                    ] + textAfterPointerMulti.split(';')[0]
                )
                const currentTable = tableInfoList.find(
                    (item) => item.tableAlia === tokenNoDot.replace(/^.*,/g, '')
                )
                // <别名>.<字段>联想
                if (currentTable && currentTable.tableName) {
                    return {
                        suggestions:
                            await this.getTableColumnSuggestByTableAlia(
                                currentTable.tableName
                            ),
                    }
                } else {
                    return {
                        suggestions: [],
                    }
                }
            } else {
                return {
                    suggestions: [],
                }
            }
            // 库名联想
        } else if (
            lastToken === 'from' ||
            lastToken === 'join' ||
            /(from|join)\s+.*?\s?,\s*$/.test(
                textBeforePointer.replace(/.*?\(/gm, '').toLowerCase()
            )
        ) {
            // const tableOptions = this.getTableSuggest()
            const databases = this.getDataBaseSuggest()
            return {
                suggestions: databases,
            }
            // 字段联想
        } else if (
            [
                'select',
                'where',
                'order by',
                'group by',
                'by',
                'and',
                'or',
                'having',
                'distinct',
                'on',
            ].includes(lastToken.replace(/.*?\(/g, '')) ||
            (lastToken.endsWith('.') &&
                !this.databaseOptions.find(
                    (databaseOption) =>
                        `${databaseOption.databaseName}.` === lastToken
                )) ||
            /(select|where|order by|group by|by|and|or|having|distinct|on)\s+.*?\s?,\s*$/.test(
                textBeforePointer.toLowerCase()
            )
        ) {
            return {
                suggestions: await this.getTableColumnSuggest(),
            }
            // 自定义字段联想
        } else if (this.customKeywords.toString().includes(lastToken)) {
            return {
                suggestions: this.getCustomSuggest(lastToken.startsWith('$')),
            }
            // 默认联想
        } else {
            return {
                suggestions: [
                    ...this.getDataBaseSuggest(),
                    ...this.getTableSuggest(),
                    ...this.getKeywordSuggest(),
                ],
            }
        }
    }

    /**
     * 获取自定义联想建议
     */
    getCustomSuggest(startsWith$: boolean): Array<SuggestOption> {
        return this.customKeywords.map((customKeyword) => ({
            label: customKeyword,
            kind: this.monacoEditor.languages.CompletionItemKind.Keyword,
            detail: '',
            sortText: this.sortText.Keyword,
            // Fix插入两个$符号
            insertText: startsWith$ ? customKeyword.slice(1) : customKeyword,
            // range: {
            //     startColumn: 0,
            // }
        }))
    }

    /**
     * 获取所有字段
     */
    // getAllTableColumn() {
    //     const tableColumnOptions: Array<SuggestOption> = []
    //     this.databaseOptions.forEach((databaseOption) => {
    //         databaseOption.tableOptions.forEach((tableOption) => {
    //             tableOption.tableColumnOptions.forEach((tableColumnOption) => {
    //                 tableColumnOptions.push({
    //                     label: tableColumnOption.columnName
    //                         ? tableColumnOption.columnName
    //                         : '',
    //                     kind: this.monacoEditor.languages.CompletionItemKind.Module,
    //                     detail: `<字段>`,
    //                     sortText: this.sortText.Column,
    //                     insertText: tableColumnOption.columnName
    //                         ? tableColumnOption.columnName
    //                         : '',
    //                 })
    //             })
    //         })
    //     })
    //     return tableColumnOptions
    // }

    /**
     * 获取数据库库名联想建议
     */
    getDataBaseSuggest() {
        return this.databaseOptions.map((databaseOption) => {
            return {
                label: databaseOption.databaseName
                    ? databaseOption.databaseName
                    : '',
                kind: this.monacoEditor.languages.CompletionItemKind.Class,
                detail: `<数据库>`,
                sortText: this.sortText.Database,
                insertText: databaseOption.databaseName
                    ? databaseOption.databaseName
                    : '',
            }
        })
    }

    /**
     * 获取关键字联想建议
     * @param {*} keyword
     */
    getKeywordSuggest = () => {
        return this.databaseKeywords.map((databaseKeyword) => ({
            label: databaseKeyword,
            kind: this.monacoEditor.languages.CompletionItemKind.Keyword,
            detail: '<关键字>',
            sortText: this.sortText.Keyword,
            // Fix插入两个$符号
            insertText: databaseKeyword.startsWith('$')
                ? databaseKeyword.slice(1)
                : databaseKeyword,
        }))
    }

    /**
     * 获取数据库表名建议
     */
    getTableSuggest = (): Array<SuggestOption> => {
        const suggestOptions: Array<SuggestOption> = []

        this.databaseOptions.forEach((databaseOption) => {
            databaseOption.tableOptions.forEach((tableOption) => {
                suggestOptions.push({
                    label: tableOption.tableName ? tableOption.tableName : '',
                    kind: this.monacoEditor.languages.CompletionItemKind.Struct,
                    detail: `<表> ${databaseOption.databaseName} ${tableOption.tableComment ? tableOption.tableComment : ''
                        }`,
                    sortText: this.sortText.Table,
                    insertText: tableOption.tableName
                        ? tableOption.tableName
                        : '',
                    documentation: tableOption.tableComment
                        ? tableOption.tableComment
                        : '',
                })
            })
        })
        return suggestOptions
    }

    getTableSuggestByDbName(databaseName: string): Array<SuggestOption> {
        // 从当前输入的数据库当中获取 所有的数据
        const currentDatabase = this.databaseOptions.find(
            (databaseOption) => databaseOption.databaseName === databaseName
        )

        const suggestOptions: Array<SuggestOption> = []

        if (currentDatabase) {
            currentDatabase.tableOptions.forEach((tableOption) => {
                suggestOptions.push({
                    label: tableOption.tableName ? tableOption.tableName : '',
                    kind: this.monacoEditor.languages.CompletionItemKind.Struct,
                    detail: `<表> ${currentDatabase.databaseName} ${tableOption.tableComment ? tableOption.tableComment : ''
                        }`,
                    sortText: this.sortText.Table,
                    insertText: tableOption.tableName
                        ? tableOption.tableName
                        : '',
                    documentation: tableOption.tableComment
                        ? tableOption.tableComment
                        : '',
                })
            })
        }
        return suggestOptions
    }
    /**
     * 获取所有表字段
     * @param {*} table
     * @param {*} column
     */
    getTableColumnSuggest = async () => {
        const defaultFields: Array<SuggestOption> = []

        this.databaseOptions.forEach((databaseOption) => {
            databaseOption.tableOptions.forEach((tableOption) => {
                tableOption.tableColumnOptions &&
                    tableOption.tableColumnOptions.forEach(
                        (tableColumnOption) => {
                            defaultFields.push({
                                label: tableColumnOption.columnName
                                    ? tableColumnOption.columnName
                                    : '',
                                kind: this.monacoEditor.languages.CompletionItemKind
                                    .Field,
                                detail: `<字段> ${tableColumnOption.commentName
                                    ? tableColumnOption.commentName
                                    : ''
                                    } <${tableColumnOption.columnType}>`,
                                sortText: this.sortText.Column,
                                insertText: tableColumnOption.columnName
                                    ? tableColumnOption.columnName
                                    : '',
                                documentation: {
                                    value: `
  ### 数据库: ${tableColumnOption.databaseName}
  ### 表: ${tableColumnOption.tableName}
  ### 注释: ${tableColumnOption.commentName ? tableColumnOption.commentName : ''
                                        }
              `,
                                },
                            })
                        }
                    )
            })
        })

        const asyncFields: Array<SuggestOption> = []

        if (typeof this.onInputTableColumn === 'function') {
            const fileds = await this.onInputTableColumn()
            fileds.forEach((field: any) => {
                asyncFields.push({
                    label: field.columnName ? field.columnName : '',
                    kind: this.monacoEditor.languages.CompletionItemKind.Field,
                    detail: `<字段> ${field.commentName ? field.commentName : ''
                        } <${field.columnType}>`,
                    sortText: this.sortText.Column,
                    insertText: field.columnName ? field.columnName : '',
                    documentation: {
                        value: `
### 数据库: ${field.databaseName}
### 表: ${field.tableName}
### 注释: ${field.commentName ? field.commentName : ''}
            `,
                    },
                })
            })
        }

        return [...defaultFields, ...asyncFields]
    }

    /**
     * 根据别名获取所有表字段
     * @param {*} table
     * @param {*} column
     */
    async getTableColumnSuggestByTableAlia(tableName: string) {
        const defaultFields: Array<SuggestOption> = []

        this.databaseOptions.forEach((databaseOption) => {
            databaseOption.tableOptions.forEach((tableOption) => {
                tableOption.tableColumnOptions &&
                    tableOption.tableColumnOptions.forEach(
                        (tableColumnOption) => {
                            defaultFields.push({
                                label: tableColumnOption.columnName
                                    ? tableColumnOption.columnName
                                    : '',
                                kind: this.monacoEditor.languages.CompletionItemKind
                                    .Field,
                                detail: `<字段> ${tableColumnOption.commentName
                                    ? tableColumnOption.commentName
                                    : ''
                                    } <${tableColumnOption.columnType}>`,
                                sortText: this.sortText.Column,
                                insertText: tableColumnOption.columnName
                                    ? tableColumnOption.columnName
                                    : '',
                                documentation: {
                                    value: `
  ### 数据库: ${tableColumnOption.databaseName}
  ### 表: ${tableColumnOption.tableName}
  ### 注释: ${tableColumnOption.commentName ? tableColumnOption.commentName : ''
                                        }
              `,
                                },
                            })
                        }
                    )
            })
        })

        const asyncFields: Array<SuggestOption> = []

        if (typeof this.onInputTableAila === 'function') {
            const fileds = await this.onInputTableAila(tableName)
            fileds.forEach((field: any) => {
                asyncFields.push({
                    label: field.columnName ? field.columnName : '',
                    kind: this.monacoEditor.languages.CompletionItemKind.Field,
                    detail: `<字段> ${field.commentName ? field.commentName : ''
                        } <${field.columnType}>`,
                    sortText: this.sortText.Column,
                    insertText: field.columnName ? field.columnName : '',
                    documentation: {
                        value: `
### 数据库: ${field.databaseName}
### 表: ${field.tableName}
### 注释: ${field.commentName ? field.commentName : ''}
            `,
                    },
                })
            })
        }
        return [...defaultFields, ...asyncFields]
    }

    /**
     * 获取sql中所有的表名和别名
     * @param {*} sqlText SQL字符串
     */
    getTableNameAndTableAlia(sqlText: string) {
        const regTableAliaFrom =
            /(^|(\s+))from\s+([^\s]+(\s+|(\s+as\s+))[^\s]+(\s+|,)\s*)+(\s+(where|left|right|full|join|inner|union))?/gi

        const regTableAliaJoin =
            /(^|(\s+))join\s+([^\s]+)\s+(as\s+)?([^\s]+)\s+on/gi

        const regTableAliaFromList = sqlText.match(regTableAliaFrom)
            ? sqlText.match(regTableAliaFrom)
            : []

        const regTableAliaJoinList = sqlText.match(regTableAliaJoin)
            ? sqlText.match(regTableAliaJoin)
            : []

        const strList = [
            // @ts-ignore
            ...regTableAliaFromList.map((item) =>
                item
                    .replace(/(^|(\s+))from\s+/gi, '')
                    .replace(
                        /\s+(where|left|right|full|join|inner|union)((\s+.*?$)|$)/gi,
                        ''
                    )
                    .replace(/\s+as\s+/gi, ' ')
                    .trim()
            ),
            // @ts-ignore
            ...regTableAliaJoinList.map((item) =>
                item
                    .replace(/(^|(\s+))join\s+/gi, '')
                    .replace(/\s+on((\s+.*?$)|$)/, '')
                    .replace(/\s+as\s+/gi, ' ')
                    .trim()
            ),
        ]
        const tableList: Array<any> = []
        strList.map((tableAndAlia) => {
            tableAndAlia.split(',').forEach((item) => {
                const tableName = item.trim().split(/\s+/)[0]
                const tableAlia = item.trim().split(/\s+/)[1]
                tableList.push({
                    tableName,
                    tableAlia,
                })
            })
        })
        return tableList
    }
}
