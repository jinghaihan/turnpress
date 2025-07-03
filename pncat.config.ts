import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  ignorePaths: 'template',
  catalogRules: mergeCatalogRules([
    { name: 'utils', match: [/cheerio/] },
    { name: 'markdown', match: [/turndown/] },
  ]),
})
