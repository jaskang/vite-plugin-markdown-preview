// import { remarkFile } from './remark'
import { remarkFile } from './markdown-it'
import { VueDocPluginOptions } from '.'

const slash = require('slash')
const debug = require('debug')('vite:vuedoc:md')

export const VUEDOC_PREFIX = 'vdpv_'
export const VUEDOC_RE = /(.*?\.md)_(vdpv_\d+)/

export function createMarkdownRenderFn(options: VueDocPluginOptions, isBuild = false) {
  const { wrapperClass, previewClass, markdownItPlugins } = options
  // const { theme = 'default' } = prism
  return async (file: string, publicPath: string) => {
    const start = Date.now()
    const { template, vueBlocks, matter } = await remarkFile(file, {
      vuePrefix: VUEDOC_PREFIX,
      previewClass,
      plugins: markdownItPlugins
    })

    const docComponent = `
    <template>
      <div class="vuedoc ${wrapperClass || ''} ${matter.wrapperClass || ''}">
        ${template}
      </div>
    </template>
    <script>
    import { defineComponent, reactive, ref, toRefs, onMounted } from 'vue';

    

    ${vueBlocks
      .map(demo => {
        const request = `${slash(publicPath)}_${demo.id}`
        debug(`file:${publicPath} request:${request}`)
        return `import ${demo.id} from '${request}${isBuild ? '.vue' : ''}';`
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
        ${vueBlocks.map(demo => demo.id).join(',')}
      },
      setup(props) {
        ${vueBlocks.map(demo => `const ${demo.id}Ref = ref()`).join('\n')}
        const refs = [${vueBlocks.map(demo => `${demo.id}Ref`).join(',')}]
        const state = reactive({
          ${vueBlocks.map(demo => `${demo.id}Height: '0px'`).join(',')}
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
          ${vueBlocks.map(demo => `${demo.id}Ref`).join(',')}
        }
      }
    });
    script.matter = ${JSON.stringify(matter)}
    export default script;
    
    ${isBuild ? '' : 'if (import.meta.hot) { import.meta.hot.accept(); }'}
    
    </script>
    `

    debug(`[render] ${file} in ${Date.now() - start}ms.`)

    const result = { component: docComponent, demos: [...vueBlocks] }
    return result
  }
}
