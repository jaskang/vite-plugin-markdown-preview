import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'
import { VUEDOC_DEMO_PREFIX } from './resolver'
import { VueDocPluginOptions } from '.'

const prism = require('prismjs')
const loadLanguages = require('prismjs/components/index')
const escapeHtml = require('escape-html')
const debug = require('debug')('vuedoc:md')

// required to make embedded highlighting work...
loadLanguages(['markup', 'css', 'less', 'scss', 'javascript', 'typescript'])

export type DemoType = {
  id: string
  code: string
}

function wrap(code: string, lang: string): string {
  if (lang === 'text') {
    code = escapeHtml(code)
  }
  return `<pre v-pre><code class="language-${lang}">${code}</code></pre>`
}

export function createMarkdownRenderFn(options: VueDocPluginOptions, isBuild = false) {
  const { wrapperClass, previewClass, markdownPlugins } = options
  let demos: DemoType[] = []

  const markdown = new MarkdownIt('default', {
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (code: string, lang: string) {
      if (!lang) {
        return wrap(code, 'text')
      }
      if (lang === 'vue') {
        const id = `${VUEDOC_DEMO_PREFIX}${demos.length}`
        const sourceHtml = prism.highlight(code, prism.languages.markup, 'markup')
        // console.log(sourceHtml)
        demos.push({ id, code })
        return `<pre style="display:none;"></pre>
        <div class="vuedoc-demo ${previewClass}">
          <div class="vuedoc-demo__inner">
            <div class="vuedoc-demo__preview">
              <${id} />
            </div>
            <div :style="{ height: ${id}Height + 'px' }" class="vuedoc-demo__source">
              <div ref="${id}Ref" class="vuedoc-demo__sourceref">
                ${wrap(sourceHtml, 'vue')}
              </div>
            </div>
            <div class="vuedoc-demo__footer" @click="toggleCode(${demos.length - 1})">
              {{ ${id}Height > 0 ? '隐藏代码' : '显示代码' }}
            </div>
          </div>
        </div>
        `
      }
      if (lang === 'html') {
        lang = 'markup'
      }
      if (lang === 'md') {
        lang = 'markdown'
      }
      if (lang === 'ts') {
        lang = 'typescript'
      }
      if (lang === 'py') {
        lang = 'python'
      }
      if (!prism.languages[lang]) {
        try {
          loadLanguages([lang])
        } catch (e) {
          console.error(`[vuedoc] Syntax highlight for language "${lang}" is not supported.`)
        }
      }
      if (prism.languages[lang]) {
        const result = prism.highlight(code, prism.languages[lang], lang)
        return wrap(result, lang)
      }
      return wrap(code, 'text')
    }
  })
  markdownPlugins.forEach((plugin: [any]) => {
    markdown.use(...plugin)
  })

  return (src: string, path: string) => {
    const start = Date.now()

    demos = []
    const { content, data: frontmatter } = matter(src)
    const template = markdown.render(content, {})

    const docComponent = `
    <template>
      <div class="vuedoc ${wrapperClass}">
        ${template}
      </div>
    </template>
    <script>
    import { defineComponent, reactive, ref, toRefs, onMounted } from 'vue';
    ${demos
      .map(demo => {
        return `import ${demo.id} from '${path}/${demo.id}${isBuild ? '.vue' : ''}';`
      })
      .join('\n')}

    const script = defineComponent({
      components: {
        ${demos.map(demo => demo.id).join(',')}
      },
      setup(props) {
        ${demos.map(demo => `const ${demo.id}Ref = ref()`).join('\n')}
        const refs = [${demos.map(demo => `${demo.id}Ref`).join(',')}]
        const state = reactive({
          ${demos.map(demo => `${demo.id}Height: 0`).join(',')}
        })

        const toggleCode = (index) => {
          const id = '${VUEDOC_DEMO_PREFIX}' + index
          console.log(id,refs)
          if (state[id+'Height'] === 0) {
            state[id+'Height'] = refs[index].value?.offsetHeight || 0
          } else {
            state[id+'Height'] = 0
          }
        }

        return {
          toggleCode,
          ...toRefs(state),
          ${demos.map(demo => `${demo.id}Ref`).join(',')}
        }
      }
    });
    script.matter = ${JSON.stringify(frontmatter)}
    export default script;
    
    ${isBuild ? '' : 'if (import.meta.hot) { import.meta.hot.accept(); }'}
    
    </script>
    `

    debug(`[render] ${path} in ${Date.now() - start}ms.`)

    const result = { component: docComponent, demos: [...demos] }
    return result
  }
}
