# turnpress

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

TurnPress is a CLI tool that converts .docx files into Vitepress-compatible Markdown, leveraging Pandoc and Turndown to split and structure documents for seamless Vitepress integration.

> [!NOTE]
> This project requires Pandoc to function properly. Please ensure you have [Pandoc](https://github.com/jgm/pandoc) installed before using it.

```sh
pnpx turnpress --docx ./test.docx
```

## Features

### Convert

```sh
pnpx turnpress convert --docx ./test.docx
```

The convert command (default) processes the specified DOCX file, splitting its content and generating a corresponding sidebar structure based on the document's headings. This is suitable for integrating the output into an existing VitePress project.

### Create

```sh
pnpx turnpress create --docx ./test.docx
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

| Option                  | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| `--docx, -d <path>`         | **Input file**: Path to the `.docx` file (required).         |
| `--pandoc, -p <path>`       | **Pandoc path**: Custom path to Pandoc executable. |
| `--workspace, -w <dir>` | **Work directory**: Where generated are saved (default: `./turnpress`). |

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
