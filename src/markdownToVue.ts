// import { remarkFile } from './remark'
import { remarkFile } from './markdown-it'
import { VueDocPluginOptions } from './plugin'

const slash = require('slash')
const debug = require('debug')('vite:vuedoc:md')

export const VUEDOC_PREFIX = 'vdpv_'
export const VUEDOC_RE = /(.*?\.md)_(vdpv_\d+)/

export function createMarkdownRenderFn(options: VueDocPluginOptions, isBuild = false) {
  const { wrapperClass } = options
  // const { theme = 'default' } = prism
  return (code: string, file: string) => {
    const start = Date.now()
    const { template, demoBlocks, matter, toc } = remarkFile(code, {
      vuePrefix: VUEDOC_PREFIX,
      file: file,
      ...options
    })
    const $vd = { matter, toc }

    const docComponent = `
    <template>
      <div class="vuedoc ${wrapperClass || ''} ${matter.wrapperClass || ''}">
        ${template}
      </div>
    </template>
    <script>
    import { defineComponent, reactive, ref, toRefs, onMounted } from 'vue'

    

    ${demoBlocks
      .map(demo => {
        const request = `${slash(file)}.${demo.id}`
        debug(`file:${file} request:${request}`)
        return `import ${demo.id} from '${request}'`
      })
      .join('\n')}
    
    function injectCss(css, id) {
      if (!document.head.querySelector('#' + id)) {
        const node = document.createElement('style')
        node.textContent = css 
        node.type = 'text/css'
        node.id = id
        document.head.appendChild(node)
      }
    }
    
    const script = defineComponent({
      components: {
        ${demoBlocks.map(demo => demo.id).join(',')}
      },
      setup(props) {
        ${demoBlocks.map(demo => `const ${demo.id}Ref = ref()`).join('\n')}
        const refs = [${demoBlocks.map(demo => `${demo.id}Ref`).join(',')}]
        const state = reactive({
          ${demoBlocks.map(demo => `${demo.id}Height: '0px'`).join(',')}
        })

        const toggleCode = (index) => {
          const id = '${VUEDOC_PREFIX}' + index
          if (state[id+'Height'] === '0px') {
            state[id+'Height'] = ((refs[index].value ? refs[index].value.offsetHeight : 0) || 0) + 'px'
          } else {
            state[id+'Height'] = 0 + 'px'
          }
        }

        return {
          toggleCode,
          ...toRefs(state),
          ${demoBlocks.map(demo => `${demo.id}Ref`).join(',')}
        }
      }
    });
    script.$vd = ${JSON.stringify($vd)}
    export default script;
    
    ${isBuild ? '' : 'if (import.meta.hot) { import.meta.hot.accept(); }'}
    
    </script>
    `

    debug(`[render] ${file} in ${Date.now() - start}ms.`)

    const result = { component: docComponent, demoBlocks: [...demoBlocks] }
    return result
  }
}
