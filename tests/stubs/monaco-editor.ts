// monaco-editor 运行时桩:SqlSnippets 只使用 languages.CompletionItemKind
// 数值与 monaco.languages.CompletionItemKind 保持一致
export const languages = {
  CompletionItemKind: {
    Field: 3,
    Class: 5,
    Struct: 6,
    Keyword: 13,
  },
}
