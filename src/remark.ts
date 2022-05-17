import { createHash } from 'crypto'
import path from 'path'
import type { Transformer, Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Code, HTML, Parent } from 'mdast'

function md5(str: string): string {
  return createHash('md5').update(str).digest('hex')
}

// interface Code {
//   type: 'code'
//   lang?: string
//   meta?: string
// }

const fileCodeMap = new Map<string, string[]>()

export type CodeBlock = { name: string; path: string; code: string }

export type RemarkVueOptions = {
  file: string
  root: string
  highlighter: (code: string) => string
  remove: (ids: string[]) => void
  update: (blocks: CodeBlock[]) => void
}

export function remarkVue(options: RemarkVueOptions): Plugin {
  const { file, root, highlighter, remove, update } = options

  const resolve = (...args: string[]) => {
    let ret = path.resolve(path.dirname(file), ...args)
    ret = path.relative(root, ret)
    return `/${ret}`
  }
  function transformer(tree): Transformer {
    const oldBlocks = fileCodeMap.get(file) || []
    const blocks: CodeBlock[] = []
    visit(tree, 'code', (node: Code, i: number, parent: Parent) => {
      const attrs = (node.meta || '').split(' ').reduce((prev, curr) => {
        const [key, value] = curr.split('=')
        if (typeof value === 'undefined') {
          prev[key] = true
        } else {
          prev[key] = value
        }
        return prev
      }, {} as Record<string, string | boolean>)

      if (node.lang === 'vue' && attrs['preview']) {
        const name = `VueCode${md5(file).substr(0, 8)}I${i}`
        const component = typeof attrs['preview'] === 'string' ? attrs['preview'] : 'VueCode'
        const code = highlighter(node.value)
        blocks.push({ name, path: resolve(`./${name}.vue`), code: node.value })
        const demoNode: HTML = {
          type: 'html',
          value: `<${component} source="${encodeURIComponent(code)}">
  <${name} />
</${component}>`,
        }
        parent.children.splice(i, 1, demoNode)
      }
    })
    const names = blocks.map(i => i.name)
    remove(oldBlocks)
    fileCodeMap.set(file, names)
    update(blocks)

    const imports = names.reduce((prev, curr) => {
      return `${prev}import ${curr} from "${resolve(`./${curr}.vue`)}"\n`
    }, '')
    const script = `<script setup>\n${imports}</script>`
    tree.children.splice(0, 0, { type: 'html', value: script })
    return tree
  }

  return transformer
}
