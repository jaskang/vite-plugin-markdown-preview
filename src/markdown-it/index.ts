import fs from 'fs-extra'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { hljsDefineVue } from './vue'

const debug = require('debug')('vite:vuedoc:markdown-it')
const highlightDebug = require('debug')('vite:vuedoc:highlight')

hljs.registerLanguage('vue', hljsDefineVue)
type remarkOption = {
  vuePrefix: string
  previewClass?: string
  plugins?: any[]
}

export type VueBlockType = {
  id: string
  code: string
}

export const remarkFile = async (
  file: string,
  options: remarkOption
): Promise<{
  template: string
  matter: Record<string, any>
  vueBlocks: VueBlockType[]
}> => {
  // const { vuePrefix, previewClass = '', plugins = [] } = options

  const md = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    breaks: false,
    langPrefix: 'language-',
    linkify: false,
    typographer: false,
    quotes: '\u201c\u201d\u2018\u2019',
    highlight: function (code: string, lang: string, attrs: any) {
      highlightDebug('highlight:', lang, attrs)
      const highlighted = hljs.highlight(lang, code)
      const { value = '' } = highlighted
      return `<pre style="display:none;"></pre><pre><code>${value}</code></pre>`
    }
  })
  const source = await fs.readFile(file, 'utf-8')
  const result = md.render(source)
  debug(result)
  return { template: result, matter: {}, vueBlocks: [] }
}
