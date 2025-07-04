import type { CommandOptions, Options } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { extname, isAbsolute, resolve } from 'pathe'
import { createConfigLoader } from 'unconfig'
import { DEFAULT_OPTIONS, FILE_TYPE_CHOICES } from './constants'

export async function resolveConfig(options: Partial<CommandOptions>): Promise<Options> {
  const loader = createConfigLoader<CommandOptions>({
    sources: [
      {
        files: [
          'turnpress.config',
        ],
      },
      {
        files: [
          '.turnpressrc',
        ],
        extensions: ['json', ''],
      },
    ],
    cwd: options.cwd || process.cwd(),
    merge: false,
  })

  const config = await loader.load()

  const merged: Partial<Options> = {
    ...DEFAULT_OPTIONS,
    ...options,
    ...config.config,
  }

  merged.cwd = merged.cwd || process.cwd()

  if (!isAbsolute(merged.workspace!))
    merged.workspace = resolve(merged.cwd!, merged.workspace!)

  if (!merged.file && !merged.md && !merged.docx) {
    const result = await p.text({
      message: `Enter the path to your file`,
    })
    if (!result || typeof result !== 'string') {
      p.outro()
      process.exit(1)
    }
    merged.file = result
  }

  merged.type = getFileType(merged)
  if (!merged.type) {
    p.outro(c.red(`Invalid file type. Please use one of the following: ${FILE_TYPE_CHOICES.join('|')}`))
    process.exit(1)
  }

  if (merged.type === 'docx' && !options.docx)
    merged.docx = merged.file

  if (merged.type === 'md' && !options.md)
    merged.md = merged.file

  return merged as Options
}

function getFileType(options: Partial<Options>) {
  if (options.docx)
    return 'docx'

  if (options.md)
    return 'md'

  if (options.file) {
    const ext = extname(options.file)

    if (ext === '.docx')
      return 'docx'

    if (ext === '.md')
      return 'md'
  }
}
