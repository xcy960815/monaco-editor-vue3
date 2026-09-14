<template>
  <div
    class="app-shell"
    :class="{ 'app-embedded': embedded }"
    :data-theme="isDark ? 'dark' : 'light'"
  >
    <template v-if="!embedded">
      <div class="backdrop" aria-hidden="true">
        <div class="backdrop-glow backdrop-glow-a"></div>
        <div class="backdrop-glow backdrop-glow-b"></div>
        <div class="backdrop-grid"></div>
      </div>

      <header class="app-header">
        <a class="brand" href="/">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
              <path d="M3.5 9.5h17" />
              <path d="m10 12.5-2.2 2 2.2 2" />
              <path d="m14 12.5 2.2 2-2.2 2" />
            </svg>
          </span>
          <span class="brand-name">vue3-<strong>monaco</strong>-editor</span>
        </a>

        <nav class="header-actions">
          <button
            class="icon-button"
            type="button"
            aria-label="切换明暗主题"
            @click="toggleTheme"
          >
            <svg
              class="icon-sun"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path
                d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"
              />
            </svg>
            <svg
              class="icon-moon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M20 13.2A8.2 8.2 0 0 1 10.8 4 8.2 8.2 0 1 0 20 13.2Z" />
            </svg>
          </button>
          <a
            class="github-link"
            :href="repoUrl"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 6.82a9.55 9.55 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
              />
            </svg>
            <span>GitHub</span>
          </a>
        </nav>
      </header>

      <section class="hero-strip">
        <div class="hero-main">
          <div class="hero-badges">
            <span class="badge badge-live"><i></i>Live Demo</span>
            <span class="badge">v0.2.6</span>
            <span class="badge">Vue 3</span>
            <span class="badge">MIT</span>
          </div>
          <h1>
            把 Monaco 装进 Vue 3。<span class="grad">SQL 补全开箱即用。</span>
          </h1>
        </div>
        <div class="install-pill">
          <code>npm i vue3-monaco-editor</code>
          <button
            class="icon-button"
            type="button"
            aria-label="复制安装命令"
            @click="copyInstall"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="8" y="8" width="11" height="11" rx="2" />
              <path
                d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
              />
            </svg>
          </button>
        </div>
      </section>
    </template>

    <div class="playground">
      <aside class="case-nav">
        <p class="case-nav-title">SQL 示例</p>
        <button
          v-for="scenario in scenarios"
          :key="scenario.id"
          class="case-link"
          :class="{ 'is-active': scenario.id === activeScenario }"
          type="button"
          @click="selectScenario(scenario)"
        >
          {{ scenario.title }}
        </button>
        <p class="case-nav-note">
          选择示例载入编辑器，输入 . 或空格触发库、表、字段补全。
        </p>
      </aside>

      <section class="layout-page">
        <div class="demo-panel">
          <div class="toolbar-card">
            <label class="demo-field">
              <span>Height</span>
              <input
                v-model.number="monacoEditorHeight"
                min="160"
                step="20"
                type="number"
              />
            </label>
            <label class="demo-field">
              <span>Width</span>
              <input
                v-model.number="monacoEditorWidth"
                min="0"
                step="20"
                type="number"
              />
            </label>
            <label class="demo-field">
              <span>Theme</span>
              <select v-model="monacoEditorTheme">
                <option value="vs">vs</option>
                <option value="vs-dark">vs-dark</option>
                <option value="hc-black">hc-black</option>
              </select>
            </label>
            <button class="reset-button" type="button" @click="handleReset">
              Reset
            </button>
          </div>

          <div class="editor-surface">
            <MonacoEditor
              ref="monacoEditorRef"
              v-model="defaultSql"
              :custom-keywords="customKeywords"
              :database-options="databaseOptions"
              :height="monacoEditorHeight"
              :monaco-editor-theme="monacoEditorTheme"
              :width="monacoEditorWidth"
            />
          </div>
        </div>
      </section>
    </div>

    <div class="toast-stack" aria-live="polite"></div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { MonacoEditor } from './components'
import type { DatabaseOption, ThemeType } from './components'

type MonacoEditorExpose = {
  resetEditor: () => void
}

type Scenario = {
  id: string
  title: string
  code: string
}

const props = defineProps<{ embedded?: boolean }>()

const THEME_STORAGE_KEY = 'vme-demo-theme'
const repoUrl = 'https://github.com/xcy960815/monaco-editor-vue3'
const installCommand = 'npm i vue3-monaco-editor'

const scenarios: Scenario[] = [
  {
    id: 'basic',
    title: '基础查询',
    code: `select *
from databaseName1.tableName1 t
where t.fieldName1 = "小明"
limit 100`,
  },
  {
    id: 'join',
    title: '多表关联',
    code: `select t.fieldName1, u.fieldName2
from databaseName1.tableName1 t
left join databaseName2.tableName1 u
  on t.fieldName1 = u.fieldName1
where t.fieldName2 is not null`,
  },
  {
    id: 'aggregate',
    title: '聚合统计',
    code: `select t.fieldName1, count(*) as total
from databaseName1.tableName1 t
group by t.fieldName1
having count(*) > 1
order by total desc`,
  },
  {
    id: 'ddl',
    title: '建表语句',
    code: `create table if not exists tableName2 (
  fieldName1 string comment "字段一",
  fieldName2 bigint comment "字段二"
) comment "演示表"`,
  },
  {
    id: 'keyword',
    title: '自定义关键字',
    code: `select test1, test2
from databaseName1.tableName1 t
where t.fieldName1 like "%test%"
limit 10`,
  },
]

const isDark = ref(document.documentElement.classList.contains('dark'))
const monacoEditorHeight = ref<number>(320)
const monacoEditorWidth = ref<number>(0)
const monacoEditorTheme = ref<ThemeType>(isDark.value ? 'vs-dark' : 'vs')
const monacoEditorRef = ref<MonacoEditorExpose | null>(null)
const activeScenario = ref(scenarios[0].id)
const defaultSql = ref(scenarios[0].code)
const customKeywords = ['test1', 'test2']
const databaseOptions = ref<Array<DatabaseOption>>([])
let themeObserver: MutationObserver | null = null

watch(isDark, (dark: boolean) => {
  monacoEditorTheme.value = dark ? 'vs-dark' : 'vs'
})

const selectScenario = (scenario: Scenario): void => {
  activeScenario.value = scenario.id
  defaultSql.value = scenario.code
}

const handleReset = (): void => {
  monacoEditorRef.value?.resetEditor()
}

const toggleTheme = (): void => {
  const dark = !isDark.value
  isDark.value = dark

  if (props.embedded) return

  const theme = dark ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme
  document.documentElement.classList.toggle('dark', dark)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#070b12' : '#f2f5f9')
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* localStorage 不可用时仅对当前会话生效 */
  }
}

const showToast = (message: string, kind: 'ok' | 'err' = 'ok') => {
  const stack = document.querySelector('.toast-stack')
  if (!stack) return

  const toast = document.createElement('div')
  toast.className = `toast toast-${kind}`
  toast.textContent = message
  stack.appendChild(toast)

  window.setTimeout(() => {
    toast.classList.add('leaving')
    window.setTimeout(() => toast.remove(), 240)
  }, 2200)
}

const copyInstall = async () => {
  try {
    await navigator.clipboard.writeText(installCommand)
    showToast('安装命令已复制')
  } catch {
    showToast('复制失败', 'err')
  }
}

onMounted(() => {
  databaseOptions.value = Array.from({ length: 10 }, (_, index) => {
    const databaseIndex = index + 1

    return {
      databaseName: `databaseName${databaseIndex}`,
      tableOptions: [
        {
          tableName: 'tableName1',
          tableComment: 'tableComment1',
          fieldOptions: ['fieldName1', 'fieldName2', 'fieldName3'].map(
            (fieldName) => ({
              fieldName,
              fieldComment: `${fieldName} comment`,
              fieldType: 'string',
              tableName: 'tableName1',
              databaseName: `databaseName${databaseIndex}`,
            }),
          ),
        },
      ],
    }
  })

  if (props.embedded) {
    themeObserver = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark')
      if (dark !== isDark.value) {
        isDark.value = dark
      }
    })
    themeObserver.observe(document.documentElement, {
      attributeFilter: ['class'],
      attributes: true,
    })
  }
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null
})
</script>
