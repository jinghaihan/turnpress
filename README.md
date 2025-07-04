# turnpress

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

TurnPress is a CLI tool that converts both Markdown (.md) and Word (.docx) files into Vitepress-compatible Markdown format. It utilizes Pandoc for document conversion and Turndown for HTML-to-Markdown transformation, automatically splitting and structuring content for seamless Vitepress integration.

> [!NOTE]
> Pandoc is required when converting DOCX files. Please ensure you have Pandoc installed if you need to process Word documents. Markdown conversion works without Pandoc.

```sh
pnpx turnpress --docx ./test.docx
```

![Image](/assets/screenshot.png)

## Features

### Convert

```sh
pnpx turnpress convert --docx ./test.docx
# or for Markdown files
pnpx turnpress convert --md ./input.md
```

The convert command (default) processes the specified DOCX or Markdown file, splitting its content and generating a corresponding sidebar structure based on the document's headings. This is suitable for integrating the output into an existing VitePress project.

### Create

```sh
pnpx turnpress create --docx ./test.docx
# or for Markdown files
pnpx turnpress create --md ./input.md
```

The create command performs the same conversion as convert, then interactively generates a VitePress template through prompts and directly integrates the processed content and images. This is ideal for initializing a new VitePress project.

## Configuration

Create a `turnpress.config.ts` file to customize behavior.

```ts
import { defineConfig } from 'turnpress'

export default defineConfig({
  pandoc: '/opt/homebrew/bin/pandoc',
})
```

You can also use environment variables to customize behavior.

| Option                     | Description                                                                 |
| -------------------------- | --------------------------------------------------------------------------- |
| `--file`, `-f` `<path>`    | **Input file**: Path to the source file (auto-detects file type).           |
| `--docx` `<path>`          | **Input file**: Path to the `.docx` file.                                   |
| `--md` `<path>`            | **Input file**: Path to the `.md` file.                                     |
| `--pandoc` `<path>`        | **Pandoc path**: Custom path to the Pandoc executable.                      |
| `--workspace`, `-w` `<dir>`| **Work directory**: Where generated files are saved (default: `./turnpress`). |

## How it Works

1. **For DOCX files**:
   - Pandoc converts `.docx` → HTML
   - Turndown transforms HTML → structured Markdown
2. **For Markdown files**:
   - Directly processes and optimizes existing Markdown
3. **Vitepress Optimization** (for both):
   - Splits documents by headings (e.g., `#` → separate files)

## Why turnpress?

Some teams prefer writing documentation in DOCX or Markdown format but need to deploy it as an offline documentation site. While Pandoc can convert DOCX to Markdown directly and Markdown requires optimization, the output often doesn't follow standard structure and may have compatibility issues with Vitepress. That's why I use Turndown to convert the HTML output from Pandoc for DOCX files and direct processing for Markdown files to achieve better results.

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
