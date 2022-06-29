import * as monaco from 'monaco-editor'
import { keywords } from './keywords'
import type { SortText, DatabaseOption, SuggestOption, TableOption } from "./type"



export default class Snippets {
    monacoEditor: any

    // 自定义关键字
    customKeywords: Array<string>

    databaseKeywords: Array<string>

    databaseOptions: Array<DatabaseOption>

    sortText: SortText

    onInputTableColumn: Function | undefined

    onInputTableAila: Function | undefined

    constructor(customKeywords?: Array<string>, databaseOptions?: Array<DatabaseOption>, onInputTableColumn?: Function, onInputTableAila?: Function) {

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
     * @example [
     *            { 
     *                  databaseName: '', 
     *                  tableOptions: [
     *                      {   
     *                          tableName: '',
     *                          fieldOptions: [
     *                               {
     *                                   fieldName: ''
     *                               }
     *                           ] 
     *                       }
     *                  ] 
     *              }
     *          ]
     */
    setDatabaseOption(databaseOptions: Array<DatabaseOption>) {
        this.databaseOptions = databaseOptions
    }

    /**
     * monaco提示方法
     * @param {monaco.editor.ITextModel} monaco
     * @param {position: monaco.Position} position
     * @return {monaco.languages.CompletionList} []
     */
    provideCompletionItems(model: monaco.editor.ITextModel, position: monaco.Position): monaco.languages.CompletionList {


        // 获取当前列和当前行
        const { lineNumber, column } = position

        // 光标前文本
        const textBeforePointer = model.getValueInRange({
            startLineNumber: lineNumber,
            startColumn: 0,
            endLineNumber: lineNumber,
            endColumn: column,
        })

        // 光标 前面所有的脚本
        const textBeforePointerMulti = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 0,
            endLineNumber: lineNumber,
            endColumn: column,
        })

        const textBeforePointerMultiSplited = textBeforePointerMulti.split(';')

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
                suggestions: this.getDataBaseSuggest(position),
            }
            // <库名>.<表名> || <别名>.<字段>
        } else if (lastToken.endsWith('.')) {
            // 去掉点后的字符串
            const tokenNoDot = lastToken.slice(0, lastToken.length - 1)

            // 获取当前数据库
            const databaseOption = this.databaseOptions.find((dboption) => dboption.databaseName === tokenNoDot.replace(/^.*,/g, ''))

            if (databaseOption) {
                // <库名>.<表名>联想
                return {
                    suggestions: [
                        ...this.getTableOptionsSuggestByDatabaseName(
                            tokenNoDot.replace(/^.*,/g, ''),
                            position
                        ),
                    ],
                }
            } else if (
                this.getTableNameAndTableAlia(
                    textBeforePointerMultiSplited[
                    textBeforePointerMultiSplited.length - 1
                    ] + textBeforePointerMultiSplited[0]
                )
            ) {
                const tableInfoList = this.getTableNameAndTableAlia(
                    textBeforePointerMultiSplited[
                    textBeforePointerMultiSplited.length - 1
                    ] + textBeforePointerMultiSplited[0]
                )

                const currentTable = tableInfoList.find((item) => item.tableAlia === tokenNoDot.replace(/^.*,/g, ''))

                // <别名>.<字段>联想
                if (currentTable && currentTable.tableName) {
                    return {
                        suggestions:
                            this.getFieldOptionsSuggestByTableAlia(
                                currentTable.tableName,
                                position
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
            // const tableOptions = this.getTableOptionsSuggest()
            const databases = this.getDataBaseSuggest(position)
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
                suggestions: this.getFieldOptionsSuggest(position),
            }

        } else if (this.customKeywords.toString().includes(lastToken)) {
            // 自定义字段联想
            console.log("进入到自定义字段联想");
            return {
                suggestions: this.getCustomSuggest(lastToken.startsWith('$'), position),
            }
        } else {
            // 默认联想
            console.log("默认联想");

            return {
                suggestions: [
                    ...this.getDataBaseSuggest(position),
                    ...this.getTableOptionsSuggest(position),
                    ...this.getKeywordSuggest(position),
                ],
            }
        }
    }

    /**
     * 获取自定义联想建议
     */
    getCustomSuggest(startsWith$: boolean, position: monaco.Position): Array<SuggestOption> {
        const { column, lineNumber } = position
        return this.customKeywords.map((customKeyword: string) => ({
            label: customKeyword,
            kind: this.monacoEditor.languages.CompletionItemKind.Keyword,
            detail: '自定义联想建议',
            sortText: this.sortText.Keyword,
            // Fix插入两个$符号
            insertText: startsWith$ ? customKeyword.slice(1) : customKeyword,
            range: {
                startColumn: column,
                endColumn: column,
                startLineNumber: lineNumber,
                endLineNumber: lineNumber
            }
        }))
    }

    /**
     * 获取所有字段
     */
    // getAllTableColumn() {
    //     const tableOptions: Array<SuggestOption> = []
    //     this.databaseOptions.forEach((databaseOption) => {
    //         databaseOption.tableOptions.forEach((tableOption) => {
    //             tableOption.tableOptions.forEach((tableColumnOption) => {
    //                 tableOptions.push({
    //                     label: tableColumnOption.fieldName
    //                         ? tableColumnOption.fieldName
    //                         : '',
    //                     kind: this.monacoEditor.languages.CompletionItemKind.Module,
    //                     detail: `<字段>`,
    //                     sortText: this.sortText.Column,
    //                     insertText: tableColumnOption.fieldName
    //                         ? tableColumnOption.fieldName
    //                         : '',
    //                 })
    //             })
    //         })
    //     })
    //     return tableOptions
    // }

    /**
     * 获取数据库库名联想建议
     */
    getDataBaseSuggest = (position: monaco.Position): Array<SuggestOption> => {
        const { column, lineNumber } = position
        return this.databaseOptions.map((databaseOption) => {
            return {
                label: databaseOption.databaseName || '',
                kind: this.monacoEditor.languages.CompletionItemKind.Class,
                detail: `<数据库>`,
                sortText: this.sortText.Database,
                insertText: databaseOption.databaseName || '',
                range: {
                    startColumn: column,
                    endColumn: column,
                    startLineNumber: lineNumber,
                    endLineNumber: lineNumber
                }
            }
        })
    }

    /**
     * 获取关键字联想建议
     * @param {monaco.Position} position
     * @return {Array<SuggestOption>} []
     */
    getKeywordSuggest = (position: monaco.Position): Array<SuggestOption> => {
        const { column, lineNumber } = position
        return this.databaseKeywords.map((databaseKeyword: string) => ({
            // 变成小写
            label: databaseKeyword.toLocaleLowerCase(),
            kind: this.monacoEditor.languages.CompletionItemKind.Keyword,
            detail: '<关键字>',
            sortText: this.sortText.Keyword,
            // Fix插入两个$符号
            insertText: databaseKeyword.startsWith('$')
                ? databaseKeyword.slice(1).toLocaleLowerCase()
                : databaseKeyword.toLocaleLowerCase(),
            range: {
                startColumn: column,
                endColumn: column,
                startLineNumber: lineNumber,
                endLineNumber: lineNumber
            }
        }))
    }

    /**
     * 获取数据库表名建议
     */
    getTableOptionsSuggest = (position: monaco.Position): Array<SuggestOption> => {
        const suggestOptions: Array<SuggestOption> = []
        const { lineNumber, column } = position
        this.databaseOptions.forEach((databaseOption: DatabaseOption) => {
            databaseOption.tableOptions.forEach((tableOption: TableOption) => {
                suggestOptions.push({
                    label: tableOption.tableName ? tableOption.tableName : '',
                    kind: this.monacoEditor.languages.CompletionItemKind.Struct,
                    detail: `<表> ${databaseOption.databaseName} ${tableOption.tableComment || ''}`,
                    sortText: this.sortText.Table,
                    insertText: tableOption.tableName || '',
                    documentation: tableOption.tableComment || '',
                    range: {
                        startLineNumber: lineNumber,
                        startColumn: column,
                        endLineNumber: lineNumber,
                        endColumn: column,
                    }
                })
            })
        })
        return suggestOptions
    }

    // 通过当前数据库 查找表选项
    getTableOptionsSuggestByDatabaseName(databaseName: string, position: monaco.Position): Array<SuggestOption> {
        const { lineNumber, column } = position
        // 从当前输入的数据库当中获取 所有的数据
        const currentDatabase = this.databaseOptions.find((databaseOption) => databaseOption.databaseName === databaseName)
        return currentDatabase ? currentDatabase.tableOptions.map((tableOption) => ({
            label: tableOption.tableName ? tableOption.tableName : '',
            kind: this.monacoEditor.languages.CompletionItemKind.Struct,
            detail: `<表> ${currentDatabase.databaseName} ${tableOption.tableComment || ''}`,
            sortText: this.sortText.Table,
            insertText: tableOption.tableName || '',
            documentation: tableOption.tableComment || '',
            range: {
                startColumn: column,
                endColumn: column,
                startLineNumber: lineNumber,
                endLineNumber: lineNumber
            }
        })) : []


    }

    /**
     * 获取表字段联想
     * @param {position} monaco.Position
     * @return Array<SuggestOption>
     */
    getFieldOptionsSuggest = (position: monaco.Position): Array<SuggestOption> => {
        const defaultFields: Array<SuggestOption> = []
        const { column, lineNumber } = position
        this.databaseOptions.forEach((databaseOption) => {
            databaseOption.tableOptions.forEach((tableOption) => {
                tableOption.fieldOptions &&
                    tableOption.fieldOptions.forEach(
                        (fieldOption) => {
                            defaultFields.push({
                                label: fieldOption.fieldName || '',
                                kind: this.monacoEditor.languages.CompletionItemKind.Field,
                                detail: `<字段> ${fieldOption.commentName || ''} <${fieldOption.fieldType}>`,
                                sortText: this.sortText.Column,
                                insertText: fieldOption.fieldName || '',
                                documentation: {
                                    value: `
  ### 数据库: ${fieldOption.databaseName}
  ### 表: ${fieldOption.tableName}
  ### 注释: ${fieldOption.commentName ? fieldOption.commentName : ''}`,
                                },
                                range: {
                                    startColumn: column,
                                    endColumn: column,
                                    startLineNumber: lineNumber,
                                    endLineNumber: lineNumber
                                }
                            })
                        }
                    )
            })
        })

        const asyncFields: Array<SuggestOption> = []

        //         if (typeof this.onInputTableColumn === 'function') {
        //             const fileds = await this.onInputTableColumn()
        //             fileds.forEach((field: any) => {
        //                 asyncFields.push({
        //                     label: field.fieldName ? field.fieldName : '',
        //                     kind: this.monacoEditor.languages.CompletionItemKind.Field,
        //                     detail: `<字段> ${field.commentName ? field.commentName : ''
        //                         } <${field.fieldType}>`,
        //                     sortText: this.sortText.Column,
        //                     insertText: field.fieldName ? field.fieldName : '',
        //                     documentation: {
        //                         value: `
        // ### 数据库: ${field.databaseName}
        // ### 表: ${field.tableName}
        // ### 注释: ${field.commentName ? field.commentName : ''}
        //             `,
        //                     },
        //                 })
        //             })
        //         }

        return [...defaultFields, ...asyncFields]
    }

    /**
     * 根据别名获取所有表字段
     * @param {tableName} 表名
     * @param {position} monaco.Position
     */
    getFieldOptionsSuggestByTableAlia = (tableName: string, position: monaco.Position): Array<SuggestOption> => {
        const defaultFields: Array<SuggestOption> = []
        const { column, lineNumber } = position
        this.databaseOptions.forEach((databaseOption) => {
            databaseOption.tableOptions.forEach((tableOption) => {
                tableOption.fieldOptions &&
                    tableOption.fieldOptions.forEach(
                        (fieldOption) => {
                            defaultFields.push({
                                label: fieldOption.fieldName || '',
                                kind: this.monacoEditor.languages.CompletionItemKind.Field,
                                detail: `<字段> ${fieldOption.commentName || ''} <${fieldOption.fieldType}>`,
                                sortText: this.sortText.Column,
                                insertText: fieldOption.fieldName || '',
                                documentation: {
                                    value: `
  ### 数据库: ${fieldOption.databaseName}
  ### 表: ${fieldOption.tableName}
  ### 注释: ${fieldOption.commentName || ''}`,
                                },
                                range: {
                                    startLineNumber: lineNumber,
                                    endLineNumber: lineNumber,
                                    startColumn: column,
                                    endColumn: column
                                }
                            })
                        }
                    )
            })
        })

        const asyncFields: Array<SuggestOption> = []

        //         if (typeof this.onInputTableAila === 'function') {
        //             const fileds = await this.onInputTableAila(tableName)
        //             fileds.forEach((field: any) => {
        //                 asyncFields.push({
        //                     label: field.fieldName ? field.fieldName : '',
        //                     kind: this.monacoEditor.languages.CompletionItemKind.Field,
        //                     detail: `<字段> ${field.commentName ? field.commentName : ''
        //                         } <${field.fieldType}>`,
        //                     sortText: this.sortText.Column,
        //                     insertText: field.fieldName ? field.fieldName : '',
        //                     documentation: {
        //                         value: `
        // ### 数据库: ${field.databaseName}
        // ### 表: ${field.tableName}
        // ### 注释: ${field.commentName ? field.commentName : ''}
        //             `,
        //                     },
        //                         range: {
        //                             startLineNumber: lineNumber,
        //                             endLineNumber: lineNumber,
        //                             startColumn: column,
        //                             endColumn: column
        //                         }
        //                 })
        //             })
        //         }
        return [...defaultFields, ...asyncFields]
    }

    /**
     * 获取sql中所有的表名和别名
     * @param {*} sqlText SQL字符串
     */
    getTableNameAndTableAlia(sqlText: string) {
        const regTableAliaFrom = /(^|(\s+))from\s+([^\s]+(\s+|(\s+as\s+))[^\s]+(\s+|,)\s*)+(\s+(where|left|right|full|join|inner|union))?/gi

        const regTableAliaJoin = /(^|(\s+))join\s+([^\s]+)\s+(as\s+)?([^\s]+)\s+on/gi

        const regTableAliaFromList = sqlText.match(regTableAliaFrom) || []

        const regTableAliaJoinList = sqlText.match(regTableAliaJoin) || []

        const strList = [
            ...regTableAliaFromList.map((item) =>
                item.replace(/(^|(\s+))from\s+/gi, '')
                    .replace(/\s+(where|left|right|full|join|inner|union)((\s+.*?$)|$)/gi, '')
                    .replace(/\s+as\s+/gi, ' ')
                    .trim()
            ),
            ...regTableAliaJoinList.map((item) =>
                item.replace(/(^|(\s+))join\s+/gi, '')
                    .replace(/\s+on((\s+.*?$)|$)/, '')
                    .replace(/\s+as\s+/gi, ' ')
                    .trim()
            )
        ]

        const tableList: Array<{ tableName: string, tableAlia: string }> = []

        strList.forEach((tableAndAlia) => {
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
