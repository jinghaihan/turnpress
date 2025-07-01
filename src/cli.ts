import type { CAC } from 'cac'
import type { ConvertOptions } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { cac } from 'cac'
import { version } from '../package.json'
import { clean } from './cleaner'
import { resolveConfig } from './config'
import { HOMEBREW_PANDOC_PATH } from './constants'
import { convertDocxToHtml, convertHtmlToMarkdown } from './converter'
import { generateSidebar } from './sidebar'
import { splitMarkdown } from './splitter'

try {
  const cli: CAC = cac('turnpress')

  cli
    .command('', 'Convert DOCX document to Vitepress-ready Markdown')
    .option('--docx <path>', 'Path to source DOCX file')
    .option('--pandoc <path>', 'Specify path to Pandoc executable')
    .option('--outputDir, -o <path>', 'Directory for generated files')
    .action(async (options: Partial<ConvertOptions>) => {
      p.intro(`${c.yellow`turnpress `}${c.dim`v${version}`}`)

      const resolved = await resolveConfig(options)

      if (!resolved.pandoc) {
        const result: string | symbol = await p.select({
          message: 'Pandoc not found, please select one',
          options: [
            {
              label: 'homebrew',
              value: HOMEBREW_PANDOC_PATH,
            },
            {
              label: '<input>',
              value: '*',
            },
          ],
        })

        if (!result || typeof result === 'symbol') {
          p.outro(c.red('Invalid pandoc path'))
          process.exit(1)
        }

        if (result === '*') {
          const result = await p.text({
            message: `Enter pandoc path, you can find it by 'where pandoc'`,
          })
          if (!result || typeof result !== 'string') {
            p.outro()
            process.exit(1)
          }
          resolved.pandoc = result
        }
        else {
          resolved.pandoc = result
        }
      }

      if (!resolved.docx) {
        const result = await p.text({
          message: `Enter the path to your DOCX file`,
        })
        if (!result || typeof result !== 'string') {
          p.outro()
          process.exit(1)
        }
        resolved.docx = result
      }

      p.log.step('Converting DOCX → HTML')
      await convertDocxToHtml(resolved)

      p.log.step('Transforming HTML → Markdown')
      await convertHtmlToMarkdown(resolved)

      p.log.step('Splitting Markdown by headings')
      const nested = await splitMarkdown(resolved)

      p.log.step('Generating VitePress sidebar structure')
      await generateSidebar(nested, resolved)

      if (resolved.clean) {
        p.log.step('Cleaning temporary files')
        await clean(resolved)
      }

      p.outro('Convert completed')
    })

  cli.help()
  cli.version(version)
  cli.parse()
}
catch (error) {
  console.error(error)
  process.exit(1)
}
