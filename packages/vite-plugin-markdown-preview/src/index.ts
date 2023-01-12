import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { type EnvType, remarkDemoBlock } from './remark'
const CODE_VUE_REGEXP = /.md.DemoBlockI\d{1,4}\.vue$/
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
  const config: MarkdownPreviewConfig = Object.assign(
    { component: 'CodePreview', type: 'vite' as const, root: '' },
    options
  )
  return {
    name: 'vite:markdown-preview',
    enforce: 'pre' as const,
    async configResolved(cfg) {
      const isVitepress = cfg.plugins.find(p => p.name === 'vitepress')
      vuePlugin = cfg.plugins.find(p => p.name === 'vite:vue')
      envType = isVitepress ? 'vitepress' : 'vite'

      config.root = cfg.root
      config.type = envType
    },
    resolveId(id) {
      if (CODE_VUE_REGEXP.test(id)) {
        return id
      }
    },
    async load(id) {
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
