import type { ConvertOptions } from './types'
import process from 'node:process'
import { createConfigLoader } from 'unconfig'
import { DEFAULT_CONVERT_OPTIONS } from './constants'

export async function resolveConfig(options: Partial<ConvertOptions>): Promise<ConvertOptions> {
  const loader = createConfigLoader<ConvertOptions>({
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

  return {
    ...DEFAULT_CONVERT_OPTIONS,
    ...options,
    ...config.config,
  }
}
