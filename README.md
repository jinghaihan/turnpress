# turnpress

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

TurnPress is a CLI tool that converts .docx files into Vitepress-compatible Markdown, leveraging Pandoc and Turndown to split and structure documents for seamless Vitepress integration.

## Installation

```sh
pnpm add -D pncat
pnpm turnpress --docx ./test.docx --outputDir ./workspace
```

## Configuration

Create a `turnpress.config.ts` file to customize behavior.

```ts
import { defineConfig } from 'turnpress'

export default defineConfig({
  pandoc: '/opt/homebrew/bin/pandoc',
})
```

You can also use environment variables to customize behavior.

| Option                  | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| `--docx <path>`         | **Input file**: Path to the `.docx` file (required).         |
| `--pandoc <path>`       | **Pandoc path**: Custom path to Pandoc executable. |
| `--outputDir, -o <dir>` | **Output directory**: Where generated are saved (default: `./workspace`). |

## How it Works

1. **Pandoc**: Converts `.docx` → HTML.
2. **Turndown**: Transforms HTML → structured Markdown.
3. **Vitepress Optimization**:
   - Splits documents by headings (e.g., `#` → separate files).

## Why turnpress?

Some teams prefer writing documentation in DOCX format but need to deploy it as an offline documentation site. While Pandoc can convert DOCX to Markdown directly, the output often doesn't follow standard structure and may have compatibility issues with Vitepress. That's why we use Turndown to convert the HTML output from Pandoc for better results.

## License

[MIT](./LICENSE) License © [jinghaihan](https://github.com/jinghaihan)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/turnpress?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/turnpress
[npm-downloads-src]: https://img.shields.io/npm/dm/turnpress?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/turnpress
[bundle-src]: https://img.shields.io/bundlephobia/minzip/turnpress?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=turnpress
[license-src]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/jinghaihan/turnpress/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/turnpress
