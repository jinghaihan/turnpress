import type { Options } from './types'
import { resolve } from 'pathe'
import { rimraf } from 'rimraf'
import { TEMP_FILES } from './constants'

export async function cleanTempFiles(options: Options) {
  const { workspace } = options

  await rimraf(TEMP_FILES.map(f => resolve(workspace, f)))
}

export async function cleanWorkspace(options: Options) {
  const { workspace } = options

  await rimraf(workspace)
}
