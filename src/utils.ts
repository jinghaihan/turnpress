import fs from 'fs-extra'

export async function copy(source: string, target: string) {
  if (source !== target) {
    await fs.copy(source, target)
  }
}
