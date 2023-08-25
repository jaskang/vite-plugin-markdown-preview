import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'

import { type EnvType, remarkDemoBlock } from './remark'

const __dirname = dirname(fileURLToPath(import.meta.url))

const CODE_VUE_REGEXP = /.md.DemoBlockI[a-zA-Z0-9]{8}\.vue$/
const DemoBlockMap = new Map<string, string>()

export type MarkdownPreviewOptions = {
  component?: string
}

export type MarkdownPreviewConfig = {
  root: string
  component: string
  type: 'vite' | 'vitepress'
}

export function MarkdownPreview(options?: MarkdownPreviewOptions): Plugin {
  let vuePlugin: any = null
  let envType: EnvType

  const codePreview = 'mdp:code-preview'
  const codePreviewId = '\0' + codePreview
  const codePreviewSource = fs.readFileSync(
    path.resolve(__dirname, './component/index.js'),
    'utf-8'
  )

  const codePreviewCss = 'mdp:code-preview.css'
  const codePreviewCssId = '\0' + codePreviewCss
  const codePreviewCssSource = fs.readFileSync(
    path.resolve(__dirname, './component/style.css'),
    'utf-8'
  )

  const config: MarkdownPreviewConfig = Object.assign(
    { component: 'CodePreview', type: 'vite' as const, root: '' },
    options
  )
  return {
    name: 'vite:markdown-preview',
    // enforce: 'pre',
    async configResolved(cfg) {
      const isVitepress = cfg.plugins.find(p => p.name === 'vitepress')
      vuePlugin = cfg.plugins.find(p => p.name === 'vite:vue')
      envType = isVitepress ? 'vitepress' : 'vite'

      config.root = cfg.root
      config.type = envType
    },
    resolveId(id) {
      if (id === codePreview) {
        return codePreviewId
      }
      if (id === codePreviewCss) {
        return codePreviewCssId
      }
      if (CODE_VUE_REGEXP.test(id)) {
        return id
      }
    },
    async load(id) {
      if (id === codePreviewId) {
        return codePreviewSource
      }
      if (id === codePreviewCssId) {
        return codePreviewCssSource
      }
      if (CODE_VUE_REGEXP.test(id)) {
        const blockId = '/' + path.relative(config.root, id)

        const demoCode = DemoBlockMap.get(id) || DemoBlockMap.get(blockId)
        return demoCode
      }
      if (id.endsWith('.md')) {
        const { code, blocks } = remarkDemoBlock(id, fs.readFileSync(id, 'utf8'), config)
        for (const k of Object.keys(blocks)) {
          const blockKey = `${id}.${k}.vue`
          const blockId = '/' + path.relative(config.root, blockKey)
          DemoBlockMap.set(blockId, blocks[k])
        }
        return code
      }
    },
    async handleHotUpdate(ctx) {
      const { file, server, timestamp } = ctx
      const { moduleGraph } = server
      server.moduleGraph
      if (file.endsWith('.md')) {
        const { blocks } = remarkDemoBlock(file, fs.readFileSync(file, 'utf8'), config)
        const updates: any[] = []
        for (const k of Object.keys(blocks)) {
          const blockKey = `${file}.${k}.vue`
          const blockId = '/' + path.relative(config.root, blockKey)
          DemoBlockMap.set(blockId, blocks[k])

          const mod = moduleGraph.getModuleById(blockId)
          if (mod) {
            // console.log(mod)
            const ret = await vuePlugin.handleHotUpdate({
              file: blockId,
              timestamp: timestamp,
              modules: [mod],
              read: () => blocks[k],
              server: server,
            })

            updates.push(...ret)
          }
        }
        if (updates.length > 0) {
          return updates.filter(Boolean)
        }
      }
    },
  }
}

export default MarkdownPreview
