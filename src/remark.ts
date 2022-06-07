import { createHash } from 'crypto'
import path from 'path'
// import type { Transformer, Plugin } from 'unified'
// import { visit } from 'unist-util-visit'
// import type { Code, HTML, Parent } from 'mdast'

function md5(str: string): string {
  return createHash('md5').update(str).digest('hex')
}

// interface Code {
//   type: 'code'
//   lang?: string
//   meta?: string
// }

export type CodeBlock = { name: string; path: string; code: string }

export type RemarkVueOptions = {
  file: string
  root: string
  update: (blocks: CodeBlock) => void
}

export function applyCodeAttributes(options: RemarkVueOptions) {
  const { file, root, update } = options

  const resolve = (...args: string[]) => {
    let ret = path.resolve(path.dirname(file), ...args)
    ret = path.relative(root, ret)
    return `/${ret}`
  }
  return (md: any) => {
    const fence = md.renderer.rules.fence
    md.renderer.rules.fence = (tokens, idx) => {
      const fenceToken = tokens[idx]

      const info = fenceToken.info ? md.utils.unescapeAll(fenceToken.info).trim() : ''
      const lang = info.split(/(\s+)/g)[0]
      console.log('lang:', lang)
      console.log('info:', fenceToken.info)
      if (lang !== 'vue') {
        const ret = fence(tokens, idx)
        return ret
      } else {
        const ret = fence(tokens, idx)
        const name = `VueCode${md5(file).substr(0, 8)}I${idx}`
        const codeComponent = `vue-code${md5(file).substr(0, 8)}-i${idx}`
        console.log(ret)

        const component = 'vue-code'
        const vueCode = `
<script setup>
import ${name} from "${resolve(`./${name}.vue`)}"
</script>\n
<${component} source="${encodeURIComponent(ret)}">
<${codeComponent} />
</${component}>`
        update({ name, path: resolve(`./${name}.vue`), code: fenceToken.content })
        return vueCode
      }
    }
  }
}

// export function remarkVue(options: RemarkVueOptions): Plugin {
//   const { file, root, update } = options

//   const resolve = (...args: string[]) => {
//     let ret = path.resolve(path.dirname(file), ...args)
//     ret = path.relative(root, ret)
//     return `/${ret}`
//   }
//   function transformer(tree): Transformer {
//     const blocks: CodeBlock[] = []
//     visit(tree, 'code', (node: Code, i: number, parent: Parent) => {
//       const attrs = (node.meta || '').split(' ').reduce((prev, curr) => {
//         const [key, value] = curr.split('=')
//         if (typeof value === 'undefined') {
//           prev[key] = true
//         } else {
//           prev[key] = value
//         }
//         return prev
//       }, {} as Record<string, string | boolean>)

//       if (node.lang === 'vue' && attrs['preview']) {
//         const name = `VueCode${md5(file).substr(0, 8)}I${i}`
//         const component = typeof attrs['preview'] === 'string' ? attrs['preview'] : 'VueCode'
//         blocks.push({ name, path: resolve(`./${name}.vue`), code: node.value })
//         const demoNode: HTML = {
//           type: 'html',
//           value: `<${component}">
//   <${name} />
//   <template #source>

//     ${node.value}

//   </template>
// </${component}>`,
//         }
//         parent.children.splice(i, 1, demoNode)
//       }
//     })
//     const names = blocks.map(i => i.name)
//     update(blocks)

//     const imports = names.reduce((prev, curr) => {
//       return `${prev}import ${curr} from "${resolve(`./${curr}.vue`)}"\n`
//     }, '')
//     const script = `<script setup>\n${imports}</script>`
//     tree.children.splice(0, 0, { type: 'html', value: script })
//     return tree
//   }

//   return transformer
// }
