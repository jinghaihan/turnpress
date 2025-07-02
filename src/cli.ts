import type { CAC } from 'cac'
import type { CommandOptions, RangeMode } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { cac } from 'cac'
import { version } from '../package.json'
import { clean } from './cleaner'
import { resolveConfig } from './config'
import { MODE_CHOICES } from './constants'
import { convertDocxToHtml, convertHtmlToMarkdown } from './converter'
import { generateSidebar } from './sidebar'
import { splitMarkdown } from './splitter'

try {
  const cli: CAC = cac('turnpress')

  cli
    .command('[mode]', 'Convert DOCX document to Vitepress-ready Markdown')
    .option('--docx, -d <path>', 'Path to source DOCX file')
    .option('--pandoc, -p <path>', 'Specify path to Pandoc executable')
    .option('--workspace, -w <path>', 'Directory for generated files')
    .action(async (mode: RangeMode, options: Partial<CommandOptions>) => {
      if (mode) {
        if (!MODE_CHOICES.includes(mode)) {
          console.error(`Invalid mode: ${mode}. Please use one of the following: ${MODE_CHOICES.join('|')}`)
          process.exit(1)
        }
        options.mode = mode
      }

      p.intro(`${c.yellow`turnpress `}${c.dim`v${version}`}`)

      const resolved = await resolveConfig(options)

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
