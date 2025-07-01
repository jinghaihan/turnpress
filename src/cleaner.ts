import type { ConvertOptions } from './types'
import path from 'node:path'
import process from 'node:process'
import { rimraf } from 'rimraf'
import { OUTPUT_DIR } from './constants'

export async function clean(options: ConvertOptions) {
  const { cwd = process.cwd(), outputDir = OUTPUT_DIR } = options

  await Promise.all([
    rimraf(path.join(cwd, outputDir, 'index.md')),
    rimraf(path.join(cwd, outputDir, 'index.html')),
  ])
}
