import path from 'path'
import fs from 'fs-extra'
import { remarkFile } from './remark'
import { VueDocPluginOptions } from '.'

const slash = require('slash')
const debug = require('debug')('vite:vuedoc:md')

export const VUEDOC_PREFIX = 'vdpv_'
export const VUEDOC_RE = /(.*?\.md)_(vdpv_\d+)/

const baseCss = fs.readFileSync(path.join(__dirname, '..', 'base.css'), 'utf8')
const themes = {
  default: fs.readFileSync(path.join(__dirname, '..', 'themes', 'prism.css'), 'utf8'),
  coy: fs.readFileSync(path.join(__dirname, '..', 'themes', 'prism-coy.css'), 'utf8'),
  dark: fs.readFileSync(path.join(__dirname, '..', 'themes', 'prism-dark.css'), 'utf8'),
  funky: fs.readFileSync(path.join(__dirname, '..', 'themes', 'prism-funky.css'), 'utf8'),
  okaidia: fs.readFileSync(path.join(__dirname, '..', 'themes', 'prism-okaidia.css'), 'utf8'),
  solarizedlight: fs.readFileSync(path.join(__dirname, '..', 'themes', 'prism-solarizedlight.css'), 'utf8'),
  tomorrow: fs.readFileSync(path.join(__dirname, '..', 'themes', 'prism-tomorrow.css'), 'utf8'),
  twilight: fs.readFileSync(path.join(__dirname, '..', 'themes', 'prism-twilight.css'), 'utf8'),
  custom: ''
}
export function createMarkdownRenderFn(options: VueDocPluginOptions, isBuild = false) {
  const { wrapperClass, previewClass, markdownPlugins, prism } = options
  const { theme = 'default' } = prism
  return async (file: string, publicPath: string) => {
    const start = Date.now()
    const { template, vueBlocks, matter } = await remarkFile(file, {
      vuePrefix: VUEDOC_PREFIX,
      previewClass,
      plugins: markdownPlugins
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
    injectCss(${JSON.stringify(baseCss)},'__vd__base__')
    injectCss(${JSON.stringify(themes[theme] || '')},'__vd__theme__')
    
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

    debug(`[render] ${path} in ${Date.now() - start}ms.`)

    const result = { component: docComponent, demos: [...vueBlocks] }
    return result
  }
}
