import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  ignorePaths: 'template',
  catalogRules: mergeCatalogRules([
    { name: 'node', match: [/cheerio/] },
    { name: 'markdown', match: [/turndown/] },
  ]),
})
