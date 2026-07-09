import { defineConfig } from 'vitepress'

const githubUrl = 'https://github.com/xcy960815/monaco-editor-vue3'

export default defineConfig({
  title: 'vue3-monaco-editor',
  description: 'A lightweight Monaco Editor component library for Vue 3.',
  base: '/monaco-editor-vue3/',
  cleanUrls: true,
  head: [['meta', { name: 'theme-color', content: '#2563eb' }]],
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      description: 'A lightweight Monaco Editor component library for Vue 3.',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/install' },
          { text: 'API', link: '/guide/api' },
          { text: 'Demo', link: '/guide/demo' },
          { text: 'GitHub', link: githubUrl },
        ],
        sidebar: [
          {
            text: 'Getting Started',
            items: [
              { text: 'Install', link: '/guide/install' },
              { text: 'API', link: '/guide/api' },
              { text: 'Online Demo', link: '/guide/demo' },
            ],
          },
        ],
        socialLinks: [{ icon: 'github', link: githubUrl }],
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © xcy960815',
        },
        outlineTitle: 'On this page',
        docFooter: {
          prev: 'Previous page',
          next: 'Next page',
        },
        langMenuLabel: 'Languages',
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme',
      },
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      description: '一个轻量的 Vue 3 Monaco Editor 组件库。',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh-CN/guide/install' },
          { text: 'API', link: '/zh-CN/guide/api' },
          { text: '演示', link: '/zh-CN/guide/demo' },
          { text: 'GitHub', link: githubUrl },
        ],
        sidebar: [
          {
            text: '开始使用',
            items: [
              { text: '安装', link: '/zh-CN/guide/install' },
              { text: 'API', link: '/zh-CN/guide/api' },
              { text: '在线演示', link: '/zh-CN/guide/demo' },
            ],
          },
        ],
        socialLinks: [{ icon: 'github', link: githubUrl }],
        footer: {
          message: '基于 MIT 协议发布。',
          copyright: 'Copyright © xcy960815',
        },
        outlineTitle: '本页目录',
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
        langMenuLabel: '语言',
        returnToTopLabel: '返回顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
      },
    },
  },
})
