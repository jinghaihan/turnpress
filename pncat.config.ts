import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  ignorePaths: ['template', 'vitepress'],
  catalogRules: mergeCatalogRules([]),
  postRun: 'eslint --fix "**/package.json" "**/pnpm-workspace.yaml"',
})
