// import visit from 'unist-util-visit'
import map from 'unist-util-map'
import { VFile } from 'vfile'

const prism = require('prismjs')
// const escapeHtml = require('escape-html')
const loadLanguages = require('prismjs/components/index')
const debug = require('debug')('vite:vuedoc:remark-code-prismjs')

const languages = [
  'bash',
  'shell',
  'python',
  'py',
  'go',
  'java',
  'sql',
  'yaml',
  'yml',
  'markdown',
  'md',
  'markup',
  'html',
  'xml',
  'svg',
  'ssml',
  'atom',
  'rss',
  'javascript',
  'css',
  'less',
  'scss',
  'stylus',
  'json',
  'javascript',
  'js',
  'typescript',
  'ts',
  'jsx',
  'tsx'
]
loadLanguages(languages)

type codePrismOption = {
  previewClass?: string
  vuePrefix: string
}

function remarkCodePrism(options: codePrismOption) {
  const { previewClass = '', vuePrefix } = options
  return function visitor(ast: Node, file: VFile) {
    if (!file.data) {
      file.data = {}
    }
    const data: any = file.data
    const vueBlocks: {
      id: string
      code: string
    }[] = (data.vueBlocks = [])

    return map(ast, (node: Node) => {
      const { meta, value } = node
      const lang = node.lang && languages.includes(node.lang) ? node.lang : 'markup'
      const isDemo = ((meta as string) || '').split(' ').includes('demo')

      if (node.type !== 'code') {
        return node
      }
      let result = ''
      if (prism.languages[lang as string]) {
        result = prism.highlight(value, prism.languages[lang], lang)
      } else {
        result = value || ''
      }
      debug(result)

      if (value && node.lang === 'vue' && isDemo) {
        const id = `${vuePrefix}${vueBlocks.length}`
        vueBlocks.push({ id, code: value })
        return Object.assign(node, {
          type: 'html',
          value: `<div class="vuedoc-demo ${previewClass}">
                  <div class="vuedoc-demo__inner">
                    <div class="vuedoc-demo__preview">
                      <${id} />
                    </div>
                    <div :style="{ height: ${id}Height }" class="vuedoc-demo__source">
                      <div ref="${id}Ref" class="vuedoc-demo__sourceref">
                      <div class="vuedoc__code ${previewClass}"><pre class="language-${lang}" ><code class="language-${lang}" v-pre="true">${result}</code></pre></div>
                      </div>
                    </div>
                    <div class="vuedoc-demo__footer" @click="toggleCode(${vueBlocks.length - 1})">
                      {{ ${id}Height > 0 ? 'hidden' : 'show' }}
                    </div>
                  </div>
                </div>`
        })
      }
      return Object.assign(node, {
        type: 'html',
        value: `<div class="vuedoc__code ${previewClass}"><pre class="language-${lang}" ><code class="language-${lang}" v-pre="true">${result}</code></pre></div>`
      })
    })
  }
}

export default remarkCodePrism
