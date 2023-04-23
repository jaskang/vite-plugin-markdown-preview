import { visit, type Node } from 'unist-util-visit'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { frontmatterFromMarkdown, frontmatterToMarkdown } from 'mdast-util-frontmatter'
import { createHash } from 'node:crypto'
import type { Code, Parent } from 'mdast'
import { MarkdownPreviewConfig } from '.'

export type EnvType = 'vite' | 'vitepress'

export function getHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').substring(0, 8)
}

function praseMeta(meta?: string | null) {
  const metaArr = (meta || '').split(' ')
  const ret: Record<string, string | boolean> = {}
  for (const m of metaArr) {
    const [key, val] = m.split('=', 2)
    ret[key] = val || true
  }
  return ret
}
export function remarkDemoBlock(id: string, code: string, config: MarkdownPreviewConfig) {
  const tree = fromMarkdown(code, {
    mdastExtensions: [frontmatterFromMarkdown(['yaml', 'toml'])],
  })

  const blocks: Record<string, string> = {}

  visit(tree as Node, 'code', (node: Code, index: number, parent: Parent) => {
    
    const lang = (node.lang || '').split(':')[0]
    const meta = praseMeta(node.meta)
    const preview = meta['preview']
    const isDemo = preview && lang === 'vue'
    if (isDemo) {
      const hash = getHash(node.value)
      const name = `DemoBlockI${hash}`
      blocks[name] = node.value

      parent.children.splice(
        index,
        1,
        {
          type: 'html',
          value: `<MarkdownPreview 
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
          value: '\n</template></MarkdownPreview>',
        }
      )
      return index + 3
    }
  })
  if (Object.keys(blocks).length > 0) {
    tree.children.push({
      type: 'html',
      value: `<script setup>\n
      import MarkdownPreview from 'vite-plugin-markdown-preview/component'
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
