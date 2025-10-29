import type { CAC } from 'cac'
import type { CommandOptions, FileType, Options, RangeMode, Spinner } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { cac } from 'cac'
import { resolve } from 'pathe'
import { cleanTempFiles } from './cleaner'
import { resolveConfig } from './config'
import { MODE_CHOICES, NAME, TEMP_MARKDOWN, VERSION } from './constants'
import { convertDocxToHtml, convertHtmlToMarkdown } from './converter'
import { create } from './create'
import { markdownMediaExtractor } from './extractor'
import { generateSidebar } from './sidebar'
import { splitMarkdown } from './splitter'
import { copy } from './utils'

try {
  const cli: CAC = cac('turnpress')

  const prepare: Record<FileType, (options: Options, spinner: Spinner) => Promise<void>> = {
    docx: async (options, spinner) => {
      spinner.message('Converting DOCX → HTML')
      await convertDocxToHtml(options)

      spinner.message('Transforming HTML → Markdown')
      await convertHtmlToMarkdown(options)
    },
    md: async (options, spinner) => {
      spinner.message('Copying Markdown → Workspace')
      await copy(resolve(process.cwd(), options.md), resolve(options.workspace, TEMP_MARKDOWN))

      await markdownMediaExtractor(options)
    },
  }

  cli
    .command('[mode]', 'Convert Markdown, Docx document to Vitepress-ready Markdown')
    .option('--file, -f <path>', 'Path to source file')
    .option('--docx <path>', 'Path to source DOCX file')
    .option('--md <path>', 'Path to source Markdown file')
    .option('--pandoc <path>', 'Specify path to Pandoc executable')
    .option('--workspace, -w <path>', 'Directory for generated files')
    .action(async (mode: RangeMode, options: Partial<CommandOptions>) => {
      if (mode) {
        if (!MODE_CHOICES.includes(mode)) {
          p.log.error(`Invalid mode: ${mode}. Please use one of the following: ${MODE_CHOICES.join('|')}`)
          process.exit(1)
        }
        options.mode = mode
      }

      p.intro(`${c.yellow`${NAME} `}${c.dim`v${VERSION}`}`)

      const spinner = p.spinner()
      spinner.start()

      const config = await resolveConfig(options)
      await prepare[config.type](config, spinner)

      spinner.message('Splitting Markdown by headings')
      const nested = await splitMarkdown(config)

      spinner.message('Generating VitePress sidebar structure')
      await generateSidebar(nested, config)

      if (config.clean) {
        spinner.message('Cleaning temporary files')
        await cleanTempFiles(config)
      }

      if (config.mode === 'convert') {
        spinner.stop(c.green('Convert completed'))
        p.outro('Done')
        process.exit(0)
      }
      else {
        spinner.stop(c.green('Convert completed'))
        await create(config)
      }
    })

  cli.help()
  cli.version(VERSION)
  cli.parse()
}
catch (error) {
  console.error(error)
  process.exit(1)
}
