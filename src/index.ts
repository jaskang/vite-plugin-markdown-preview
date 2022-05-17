import type { Plugin, PluginOption, Update } from 'vite'
import { remark } from 'remark'
import { remarkVue } from './remark'

export type MdVueOptions = {
  component?: string
}
export type TransformOptions = { component: string; root: string }

const VUE_CODE_REGEXP = /VueCode[a-z0-9]{8}I\d{1,4}\.vue$/
const vueBlockMap = new Map<string, string>()
const transformOptions = { component: 'VueCode', root: process.cwd() }

export const transformer = (code: string, file: string) => {
  const ret = remark()
    .use(remarkVue, {
      file,
      root: transformOptions.root,
      component: transformOptions.component,
      remove(codePath) {
        for (const name of codePath) {
          // console.log('remove', name);
          vueBlockMap.delete(`${name}.vue`)
        }
      },
      update(blocks) {
        for (const block of blocks) {
          // console.log('update', block.path);
          vueBlockMap.set(`${block.path}`, block.code)
        }
      },
    })
    .processSync(code)

  return ret.value as unknown as string
}

export function MarkdownVue(userOptions: MdVueOptions = {}): PluginOption[] {
  const { component = 'VueCode' } = userOptions

  transformOptions.component = component

  const plugin: Plugin = {
    name: 'vite:md-vue',
    enforce: 'pre',
    configResolved(config) {
      transformOptions.root = config.root
      // vuePlugin = resolvedConfig.plugins.find((p) => p.name === 'vite:vue');
    },
    resolveId(id) {
      if (VUE_CODE_REGEXP.test(id)) {
        return `${id}`
      }
    },
    load(id) {
      if (VUE_CODE_REGEXP.test(id)) {
        const code = vueBlockMap.get(id)
        return code
      }
    },
    async handleHotUpdate(ctx) {
      const { file, server } = ctx
      const { moduleGraph, ws } = server

      if (/\.md$/.test(file)) {
        const updates: Update[] = []
        for (const [name] of vueBlockMap) {
          const mods = [...(moduleGraph.getModulesByFile(name) || new Set())]
          moduleGraph.onFileChange(name)
          // console.log(mods);
          for (const mod of mods) {
            updates.push({
              type: `js-update`,
              timestamp: mod.lastInvalidationTimestamp,
              path: `${mod.url}`,
              acceptedPath: `${mod.url}`,
            })
          }
        }
        ws.send({
          type: 'update',
          updates,
        })
      }
    },
  }

  return [plugin]
}

export default MarkdownVue
