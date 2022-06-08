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
    console.log('code fence:', fence)

    md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
      const token = tokens[idx]
      const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
      const lang = info.split(/(\s+)/g)[0]
      // TODO: document tag
      if (lang === 'vue') {
        const codeHtml = fence(tokens, idx, options, env, slf)
        const hash = md5(file).substr(0, 8)
        const name = `VueCode${hash}I${idx}`
        const codeComponent = `vue-code${hash}-i${idx}`
        const component = 'vue-code'
        const vueCode = `
<script setup>
import ${name} from "${resolve(`./${name}.vue`)}"
</script>\n
<${component} source="${encodeURIComponent(codeHtml)}">
<${codeComponent} />
</${component}>`
        update({ name, path: resolve(`./${name}.vue`), code: token.content })
        return vueCode
      } else {
        const ret = fence(tokens, idx, options, env, slf)
        return ret
      }
    }
  }
}
