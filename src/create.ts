import type { DefaultTheme } from 'vitepress'
import type { Options } from './types'
import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { execa } from 'execa'
import { exists } from 'fs-extra'
import { resolve } from 'pathe'
import { rimraf } from 'rimraf'
import { glob } from 'tinyglobby'
import { cleanWorkspace } from './cleaner'
import { __dirname, DEFAULT_PROJECT_NAME, DEFAULT_PROJECT_TITLE, DEFAULT_SIDEBAR_PATH, TEMP_MARKDOWN } from './constants'
import { copy } from './utils'

export async function create(options: Options) {
  const { workspace } = options
  const [name, title] = await getProjectMeta()
  const basePath = await getSidebarPath()
  const redirect = await getRedirectPath(options)

  const cwd = resolve(`./${name}`)
  await setupProject({
    workspace,
    cwd,
    name,
    title,
    basePath,
    redirect,
  })

  if (options.clean) {
    p.log.step('Cleaning workspace')
    await cleanWorkspace(options)
  }

  await runProject(cwd)

  p.outro(c.green('Project created successfully'))
}

async function setupProject(options: {
  workspace: string
  cwd: string
  name: string
  title: string
  basePath: string
  redirect: string
}) {
  const { workspace, cwd, name, title, basePath, redirect } = options

  await copy(resolve(__dirname, '../template'), cwd)
  await copy(resolve(workspace, 'sidebar.json'), resolve(cwd, './.vitepress/sidebar.json'))

  await copy(resolve(workspace, 'assets'), resolve(cwd, `./src/${basePath}/assets`))

  await copyArticle(workspace, cwd, basePath)
  await updatePackageJson(cwd, name)
  await updateConfig(cwd, title, basePath)
  await updateRedirect(cwd, basePath, redirect)
}

async function copyArticle(workspace: string, cwd: string, basePath: string) {
  const files = await glob('**/*.md', { cwd: workspace })
  await Promise.all(
    files
      .filter(file => file !== TEMP_MARKDOWN)
      .map(file => copy(resolve(workspace, file), resolve(cwd, `./src/${basePath}/${file}`))),
  )
}

async function updatePackageJson(cwd: string, name: string) {
  const path = resolve(cwd, './package.json')
  const content = await readFile(path, 'utf-8')
  const json = JSON.parse(content)
  json.name = name
  await writeFile(path, JSON.stringify(json, null, 2))
}

async function updateConfig(cwd: string, title: string, basePath: string) {
  const path = resolve(cwd, './.vitepress/config.mts')
  const content = await readFile(path, 'utf-8')
  await writeFile(
    path,
    content
      .replaceAll('[title]', title)
      .replaceAll('[path]', basePath),
  )
}

async function updateRedirect(cwd: string, basePath: string, redirect: string) {
  const path = resolve(cwd, './src/index.md')
  const content = await readFile(path, 'utf-8')
  await writeFile(path, content.replaceAll('[redirect]', `/${basePath}/${redirect}.html`))
}

async function runProject(cwd: string) {
  const shouldRun = await p.confirm({ message: c.green('Run this project?') })

  if (!shouldRun || p.isCancel(shouldRun))
    return

  p.log.info('Running pnpm install')
  await execa('pnpm', ['install'], { stdio: 'inherit', cwd })

  await execa('pnpm', ['dev'], { stdio: 'inherit', cwd })
}

async function getProjectMeta(): Promise<string[]> {
  const name = await p.text({
    message: 'Enter a name for the directory',
    initialValue: DEFAULT_PROJECT_NAME,
  })

  if (!name || p.isCancel(name)) {
    p.outro(c.red('Aborting'))
    process.exit(1)
  }

  const cwd = resolve(process.cwd(), name)
  const e = await exists(cwd)
  if (e) {
    const result = await p.select({
      message: c.yellow('Directory already exists, change another one?'),
      options: [
        { value: 'y', label: 'Yes' },
        { value: 'n', label: 'No (Delete and continue)' },
      ],
      initialValue: 'y',
    })

    if (result === 'y')
      return getProjectMeta()

    await rimraf(cwd)
  }

  const title = await p.text({
    message: 'Enter a title for the project',
    initialValue: DEFAULT_PROJECT_TITLE,
  })
  if (!title || p.isCancel(title)) {
    p.outro(c.red('Aborting'))
    process.exit(1)
  }

  return [name, title]
}

async function getSidebarPath(): Promise<string> {
  const path = await p.text({
    message: 'Enter a path for the sidebar base',
    initialValue: DEFAULT_SIDEBAR_PATH,
  })

  if (!path || p.isCancel(path)) {
    p.outro(c.red('Aborting'))
    process.exit(1)
  }

  return path
}

async function getRedirectPath(options: Options): Promise<string> {
  const { workspace } = options
  const content = await readFile(resolve(workspace, 'sidebar.json'), 'utf-8')
  const sidebar: DefaultTheme.SidebarItem[] = JSON.parse(content)

  const item = sidebar.find(item => item.link)
    ?? sidebar.flatMap(item => item.items ?? []).find(item => item.link)

  if (!item?.link) {
    p.outro(c.red('No valid redirect link found in sidebar.json'))
    process.exit(1)
  }

  return item.link
}
