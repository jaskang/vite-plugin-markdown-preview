import { visit, type Node } from 'unist-util-visit'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { frontmatterFromMarkdown, frontmatterToMarkdown } from 'mdast-util-frontmatter'
import type { Code, Parent } from 'mdast'
import { MdPreviewConfig } from '.'

export type EnvType = 'vite' | 'vitepress'

function praseMeta(meta?: string | null) {
  const metaArr = (meta || '').split(' ')
  const ret: Record<string, string | boolean> = {}
  for (const m of metaArr) {
    const [key, val] = m.split('=', 2)
    ret[key] = val || true
  }
  return ret
}
export function remarkDemoBlock(id: string, code: string, config: MdPreviewConfig) {
  const tree = fromMarkdown(code, {
    mdastExtensions: [frontmatterFromMarkdown(['yaml', 'toml'])],
  })

  const blocks: Record<string, string> = {}

  visit(tree as Node, 'code', (node: Code, index: number, parent: Parent) => {
    const i = Object.keys(blocks).length
    const lang = (node.lang || '').split(':')[0]
    const meta = praseMeta(node.meta)
    const preview = meta['preview']
    const isDemo = preview && lang === 'vue'
    if (isDemo) {
      const name = `DemoBlockI${i}`
      blocks[name] = node.value

      parent.children.splice(
        index,
        1,
        {
          type: 'html',
          value: `<MdPreview 
lang="${decodeURIComponent(node.lang || '')}" 
meta="${decodeURIComponent(node.meta || '')}" 
code="${encodeURIComponent(node.value)}"
component="${typeof preview === 'string' ? preview : config.component}"
>
<${name}/>
<template #code>`,
        },
        node,
        {
          type: 'html',
          value: '\n</template></MdPreview>',
        }
      )
      return index + 3
    }
  })
  if (Object.keys(blocks).length > 0) {
    tree.children.push({
      type: 'html',
      value: `<script setup>\n
      import MdPreview from 'vite-plugin-md-preview/component'
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
