import type { ConvertOptions } from './types'
import path from 'node:path'
import process from 'node:process'

export const HOMEBREW_PANDOC_PATH = `/opt/homebrew/bin/pandoc`

export const OUTPUT_DIR = 'workspace'

export const DOCX_PATH = path.join(process.cwd(), OUTPUT_DIR, 'index.docx')

export const DEFAULT_CONVERT_OPTIONS: ConvertOptions = {
  // pandoc: HOMEBREW_PANDOC_PATH,
  // docx: DOCX_PATH,
  outputDir: OUTPUT_DIR,
  clean: true,
}
