import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { remarkDemoBlock } from './remark'
const CODE_VUE_REGEXP = /.md.DemoBlockI\d{1,4}\.vue$/
const DemoBlockMap = new Map<string, string>()

export function VueDoc(): Plugin {
  let envType: 'vite' | 'vitepress' | 'vuepress' = 'vite'
  let vuePlugin: any = null
  let root = ''
  return {
    name: 'vite:vuedoc',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
      const isVitepress = config.plugins.find(p => p.name === 'vitepress')
      const isVuepress = config.plugins.find(p => p.name === 'vuepress')
      vuePlugin = config.plugins.find(p => p.name === 'vite:vue')
      envType = isVitepress ? 'vitepress' : isVuepress ? 'vuepress' : 'vite'
      console.log(envType)
    },
    resolveId(id) {
      if (CODE_VUE_REGEXP.test(id)) {
        return id
      }
    },
    async load(id) {
      if (CODE_VUE_REGEXP.test(id)) {
        const demoCode = DemoBlockMap.get(id)
        return demoCode
      }
      if (id.endsWith('.md')) {
        const { code, blocks } = remarkDemoBlock(id, fs.readFileSync(id, 'utf8'))
        for (const k of Object.keys(blocks)) {
          const blockKey = `${id}.${k}.vue`
          const blockId = '/' + path.relative(root, blockKey)
          // console.log('DemoBlockMap.set', blockId, blocks[k])

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
        const { blocks } = remarkDemoBlock(file, fs.readFileSync(file, 'utf8'))
        const updates: any[] = []
        for (const k of Object.keys(blocks)) {
          const blockKey = `${file}.${k}.vue`
          const blockId = '/' + path.relative(root, blockKey)
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

export default VueDoc
