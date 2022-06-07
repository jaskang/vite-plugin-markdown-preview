import { createHash } from 'crypto'
import path from 'path'

function md5(str: string): string {
  return createHash('md5').update(str).digest('hex')
}

export type CodeBlock = { name: string; path: string; code: string }

export type RemarkVueOptions = {
  file: string
  root: string
  update: (blocks: CodeBlock) => void
}

export function fence(options: RemarkVueOptions) {
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
      console.log('lang:', lang, fenceToken.info)
      if (lang !== 'vue') {
        const ret = fence(tokens, idx)
        return ret
      } else {
        const ret = fence(tokens, idx)
        const hash = md5(file).substr(0, 8)
        const name = `VueCode${hash}I${idx}`
        const codeComponent = `vue-code${hash}-i${idx}`
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
