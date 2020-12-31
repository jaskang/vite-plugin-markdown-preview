import path from 'path'
import fs from 'fs-extra'
import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'
import hljs from 'highlight.js'
import { hljsDefineVue } from './../highlight/language-vue'
import { VueDocPluginOptions } from '../'

import MarkdownItEmoji from 'markdown-it-emoji'
import MarkdownItSub from 'markdown-it-sub'
import MarkdownItSup from 'markdown-it-sup'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItDeflist from 'markdown-it-deflist'
import MarkdownItAbbr from 'markdown-it-abbr'
import MarkdownItIns from 'markdown-it-ins'
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItLatex from 'markdown-it-latex'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItTocAndAnchor from 'markdown-it-toc-and-anchor'
import MarkdownItTasklists from 'markdown-it-task-lists'
import MarkdownItSourceMap from 'markdown-it-source-map'
import MarkdownItContainer from 'markdown-it-container'

const debug = require('debug')('vite:vuedoc:markdown-it')
const highlightDebug = require('debug')('vite:vuedoc:highlight')

hljs.registerLanguage('vue', hljsDefineVue)

export type VueBlockType = {
  id: string
  code: string
  isImport?: boolean
}

function unquote(str: string) {
  if (!str) {
    return ''
  }
  const reg = /[\'\"]/
  let ret = str
  if (reg.test(ret.charAt(0))) {
    ret = ret.substr(1)
  }
  if (reg.test(ret.charAt(ret.length - 1))) {
    ret = ret.substr(0, ret.length - 1)
  }
  return ret
}

export const remarkFile = async (
  file: string,
  options: { vuePrefix: string } & VueDocPluginOptions
): Promise<{
  template: string
  matter: Record<string, any>
  toc: Array<{ content: string; anchor: string; level: number }>
  vueBlocks: VueBlockType[]
}> => {
  const { vuePrefix, previewClass, previewComponent, markdownIt, highlight } = options
  const { plugins, containers } = markdownIt
  const { theme } = highlight
  const vueBlocks: VueBlockType[] = []
  let toc: Array<{ content: string; anchor: string; level: number }> = []
  const md = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: true,
    quotes: '\u201c\u201d\u2018\u2019',
    highlight: function (_code: string, lang: string, attrStr: string) {
      let code = _code
      const attrs = attrStr.split(' ')
      const srcAttr = attrs.find((attr: string) => attr.startsWith('src='))
      const isVueDemo = lang === 'vue' && attrs.includes('demo')
      if (srcAttr) {
        let importSrc = unquote((srcAttr.split('=')?.[1] || '').trim())
        const importPath = path.resolve(path.dirname(file), importSrc)
        try {
          const importSource = fs.readFileSync(importPath, 'utf-8')
          code = importSource
        } catch (error) {
          console.error(`demo import fail:${error.message}`)
        }
      }

      highlightDebug('highlight:', lang, 'attrs:', attrs)

      const highlighted = hljs.highlight(lang, code, true)
      const { value = '' } = highlighted
      if (isVueDemo) {
        const id = `${vuePrefix}${vueBlocks.length}`
        vueBlocks.push({ id, code })
        if (previewComponent) {
          return `<pre style="display:none;"></pre><div class="vuedoc-demo ${previewClass}">
                    <${previewComponent} lang="${lang}" theme="${theme}">
                      <template #code><pre class="hljs language-${lang} hljs--${theme}" v-pre><code>${value}</code></pre></template>
                      <${id} />
                    <$/{previewComponent}>
                </div>`
        } else {
          return `<pre style="display:none;"></pre><div class="vuedoc-demo ${previewClass}">
                  <div class="vuedoc-demo__inner">
                    <div class="vuedoc-demo__preview">
                      <${id} />
                    </div>
                    <div :style="{ height: ${id}Height }" class="vuedoc-demo__source">
                      <div ref="${id}Ref" class="vuedoc-demo__sourceref">
                      <div class="vuedoc__code ${previewClass}"><pre class="hljs language-${lang} hljs--${theme}" v-pre><code>${value}</code></pre></div>
                      </div>
                    </div>
                    <div class="vuedoc-demo__footer" @click="toggleCode(${vueBlocks.length - 1})">
                      {{ ${id}Height > 0 ? 'hidden' : 'show' }}
                    </div>
                  </div>
                </div>`
        }
      }
      return `<pre style="display:none;"></pre><pre class="hljs language-${lang} hljs--${theme}"><code>${value}</code></pre>`
    }
  })

  ;[
    [MarkdownItEmoji],
    [MarkdownItSub],
    [MarkdownItSup],
    [MarkdownItFootnote],
    [MarkdownItDeflist],
    [MarkdownItAbbr],
    [MarkdownItIns],
    [MarkdownItMark],
    [MarkdownItLatex],
    [MarkdownItKatex],
    [
      MarkdownItTocAndAnchor,
      {
        includeLevel: [2, 3],
        tocCallback: function (tocMarkdown: any, tocArray: any, tocHtml: any) {
          toc = tocArray
        }
      }
    ],
    [MarkdownItTasklists],
    [MarkdownItSourceMap],
    ...plugins
  ].forEach((plugin: [any]) => {
    md.use(...plugin)
  })
  containers.forEach(name => {
    md.use(MarkdownItContainer, name)
  })
  const source = await fs.readFile(file, 'utf-8')
  const { content, data: frontmatter } = matter(source)
  const template = md.render(content)
  debug(`mdrender -> ${file}`)
  return { template, vueBlocks, matter: frontmatter || {}, toc }
}
