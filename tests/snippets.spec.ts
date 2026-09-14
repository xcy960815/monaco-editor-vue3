import type * as monaco from 'monaco-editor'
import { describe, expect, it } from 'vitest'

import { SqlSnippets } from '../src/components/snippets'
import type { DatabaseOption } from '../src/components/types'
import { languages } from './stubs/monaco-editor'

const { CompletionItemKind } = languages

const databaseOptions: DatabaseOption[] = [
  {
    databaseName: 'warehouse_a',
    tableOptions: [
      {
        tableName: 'orders',
        tableComment: '订单表',
        fieldOptions: [
          {
            fieldName: 'id',
            fieldType: 'bigint',
            fieldComment: '主键',
            databaseName: 'warehouse_a',
            tableName: 'orders',
          },
          {
            fieldName: 'name',
            fieldType: 'string',
            fieldComment: '名称',
            databaseName: 'warehouse_a',
            tableName: 'orders',
          },
        ],
      },
    ],
  },
  {
    databaseName: 'warehouse_b',
    tableOptions: [
      {
        tableName: 'users',
        tableComment: '用户表',
        fieldOptions: [
          {
            fieldName: 'uid',
            fieldType: 'bigint',
            fieldComment: '用户 ID',
            databaseName: 'warehouse_b',
            tableName: 'users',
          },
          {
            fieldName: 'nick',
            fieldType: 'string',
            fieldComment: '昵称',
            databaseName: 'warehouse_b',
            tableName: 'users',
          },
        ],
      },
    ],
  },
]

type FakeRange = {
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
}

const makeModel = (text: string) => {
  const lines = text.split('\n')
  const lineAt = (lineNumber: number) => lines[lineNumber - 1] ?? ''
  return {
    getValueInRange: (range: FakeRange) => {
      if (range.startLineNumber === range.endLineNumber) {
        return lineAt(range.startLineNumber).slice(
          range.startColumn - 1,
          range.endColumn - 1,
        )
      }
      return [
        lineAt(range.startLineNumber).slice(range.startColumn - 1),
        ...lines.slice(range.startLineNumber, range.endLineNumber - 1),
        lineAt(range.endLineNumber).slice(0, range.endColumn - 1),
      ].join('\n')
    },
    getLineMaxColumn: (lineNumber: number) => lineAt(lineNumber).length + 1,
    getLineCount: () => lines.length,
  }
}

type Suggestion = {
  label: string
  kind?: unknown
  sortText?: string
  detail?: unknown
}

const suggest = async (
  snippets: SqlSnippets,
  sql: string,
): Promise<Suggestion[]> => {
  const lines = sql.split('\n')
  const position = {
    lineNumber: lines.length,
    column: (lines[lines.length - 1] ?? '').length + 1,
  }
  const result = await snippets.provideCompletionItems(
    makeModel(sql) as unknown as monaco.editor.ITextModel,
    position as unknown as monaco.Position,
  )
  return result.suggestions
}

const createSnippets = (
  customKeywords: Array<string> = ['test1', 'test2'],
  options: Array<DatabaseOption> = databaseOptions,
) => new SqlSnippets(customKeywords, options)

describe('SqlSnippets.provideCompletionItems', () => {
  it('suggests databases after from', async () => {
    const suggestions = await suggest(createSnippets(), 'select * from ')

    expect(suggestions.map((item) => item.label)).toEqual([
      'warehouse_a',
      'warehouse_b',
    ])
    expect(suggestions[0]?.sortText).toBe('0')
    expect(suggestions[0]?.kind).toBe(CompletionItemKind.Class)
  })

  it('suggests tables of the database after databaseName.', async () => {
    const suggestions = await suggest(
      createSnippets(),
      'select * from warehouse_a.',
    )

    expect(suggestions.map((item) => item.label)).toEqual(['orders'])
    expect(suggestions[0]?.kind).toBe(CompletionItemKind.Struct)
    expect(String(suggestions[0]?.detail)).toContain('warehouse_a')
    expect(String(suggestions[0]?.detail)).toContain('订单表')
  })

  it('suggests fields of the aliased table after alias.', async () => {
    const suggestions = await suggest(
      createSnippets(),
      'select * from warehouse_a.orders t where t.',
    )

    expect(suggestions.map((item) => item.label)).toEqual(['id', 'name'])
    expect(suggestions[0]?.sortText).toBe('2')
    expect(suggestions[0]?.kind).toBe(CompletionItemKind.Field)
    expect(String(suggestions[0]?.detail)).toContain('主键')
    expect(String(suggestions[0]?.detail)).toContain('bigint')
  })

  it('suggests fields by table name without alias', async () => {
    const suggestions = await suggest(
      createSnippets(),
      'select * from warehouse_b.users where users.',
    )

    expect(suggestions.map((item) => item.label)).toEqual(['uid', 'nick'])
  })

  it('suggests all known fields after select clause', async () => {
    const suggestions = await suggest(createSnippets(), 'select ')

    expect(suggestions).toHaveLength(4)
    expect(suggestions.map((item) => item.label).sort()).toEqual([
      'id',
      'name',
      'nick',
      'uid',
    ])
  })

  it('includes custom keywords in default suggestions', async () => {
    const suggestions = await suggest(createSnippets(), 'select te')
    const keyword = suggestions.find((item) => item.label === 'test1')

    expect(suggestions.map((item) => item.label)).toContain('test2')
    expect(keyword?.kind).toBe(CompletionItemKind.Keyword)
    expect(keyword?.sortText).toBe('3')
  })

  it('does not leak table aliases across semicolons', async () => {
    const suggestions = await suggest(
      createSnippets(),
      'select * from warehouse_a.orders t; select t.',
    )

    expect(suggestions).toEqual([])
  })

  it('supports quoted database identifiers case-insensitively', async () => {
    const suggestions = await suggest(
      createSnippets(),
      'SELECT * FROM `WAREHOUSE_A`.',
    )

    expect(suggestions.map((item) => item.label)).toEqual(['orders'])
  })

  it('suggests join table fields by join alias', async () => {
    const suggestions = await suggest(
      createSnippets(),
      'select * from warehouse_a.orders t left join warehouse_b.users u on u.',
    )

    expect(suggestions.map((item) => item.label)).toEqual(['uid', 'nick'])
  })
})

describe('SqlSnippets.updateOptions', () => {
  it('rebuilds suggestions after options change', async () => {
    const snippets = createSnippets([], [])

    await expect(
      suggest(snippets, 'select * from warehouse_a.'),
    ).resolves.toEqual([])

    snippets.updateOptions(['test1'], databaseOptions)

    const tables = await suggest(snippets, 'select * from warehouse_a.')
    expect(tables.map((item) => item.label)).toEqual(['orders'])

    const keywords = await suggest(snippets, 'select kw')
    expect(keywords.map((item) => item.label)).toContain('test1')
  })
})
