import fs from 'node:fs'
import { relative } from 'node:path'
import type { Plugin } from 'vite'
import { visit, type Node } from 'unist-util-visit'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { frontmatterFromMarkdown, frontmatterToMarkdown } from 'mdast-util-frontmatter'
import type { Code, Parent } from 'mdast'

const CODE_VUE_REGEXP = /.md.DemoBlockI\d{1,4}\.vue$/
const DemoBlockMap = new Map<string, string>()

export function remarkDemoBlock(id: string, code: string) {
  const tree = fromMarkdown(code, {
    mdastExtensions: [
      frontmatterFromMarkdown(['yaml', 'toml']),
      // gfmFromMarkdown(),
      // mathFromMarkdown(),
      // directiveFromMarkdown,
    ],
  })

  // const scriptNode = tree.children.find(n => n.type === 'html' && n.value.startsWith('<script'))
  const blocks: Record<string, string> = {}

  visit(tree as Node, 'code', (node: Code, index: number, parent: Parent) => {
    const i = Object.keys(blocks).length
    const lang = (node.lang || '').split(':')[0]
    const meta = (node.meta || '').split(' ')

    const isDemo = meta.indexOf('demo') !== -1 && lang === 'vue'
    if (isDemo) {
      const name = `DemoBlockI${i}`
      blocks[name] = node.value

      parent.children.splice(
        index,
        1,
        {
          type: 'html',
          value: `<ViteVueDoc 
lang="${decodeURIComponent(node.lang || '')}" 
meta="${decodeURIComponent(node.meta || '')}" 
code="${encodeURIComponent(node.value)}">
<${name}/>
<template #code>`,
        },
        node,
        {
          type: 'html',
          value: '\n</template></ViteVueDoc>',
        }
      )
      return index + 3
    }
  })
  if (Object.keys(blocks).length > 0) {
    tree.children.push({
      type: 'html',
      value: `<script setup>\n
      import ViteVueDoc from 'vite-plugin-vuedoc/component'
      ${Object.keys(blocks)
        .map(k => `import ${k} from "${id}.${k}.vue";`)
        .join('\n')}\n</script>`,
    })
    const code = toMarkdown(tree, {
      extensions: [frontmatterToMarkdown(['yaml', 'toml'])],
    })
    return { code, blocks }
  }
  return { code, blocks }
}

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
          const blockId = '/' + relative(root, blockKey)
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
          const blockId = '/' + relative(root, blockKey)
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
