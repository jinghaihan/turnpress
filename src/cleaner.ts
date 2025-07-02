import type { ResolvedOptions } from './types'
import path from 'node:path'
import { rimraf } from 'rimraf'

export async function clean(options: ResolvedOptions) {
  const { cwd, workspace } = options

  await Promise.all([
    rimraf(path.join(cwd, workspace, 'index.md')),
    rimraf(path.join(cwd, workspace, 'index.html')),
  ])
}
