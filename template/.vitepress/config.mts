import { defineConfig } from 'vitepress'
import { search, themeConfig } from './locales.mts'
import sidebar from './sidebar.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '[title]',
  srcDir: 'src',
  head: [
    ['link', { href: '/logo.svg', rel: 'icon', type: 'image/svg+xml' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [],
    search: {
      provider: 'local',
      options: {
        locales: {
          ...search,
        },
      },
    },
    sidebar: {
      '/[path]/': { base: '/[path]/', items: sidebar },
    },
    ...themeConfig,
  },
})
