import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: 'node',
      match: [/cheerio/],
    },
    {
      name: 'markdown',
      match: [/turndown/],
    },
  ]),
})
