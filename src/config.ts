import type { CommandOptions, ResolvedOptions } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import { createConfigLoader } from 'unconfig'
import { DEFAULT_OPTIONS } from './constants'

export async function resolveConfig(options: Partial<CommandOptions>): Promise<ResolvedOptions> {
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
  const merged = { ...DEFAULT_OPTIONS, ...options, ...config.config }

  if (!merged.docx) {
    const result = await p.text({
      message: `Enter the path to your DOCX file`,
    })
    if (!result || typeof result !== 'string') {
      p.outro()
      process.exit(1)
    }
    merged.docx = result
  }

  return merged as ResolvedOptions
}
