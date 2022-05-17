import type { Plugin, PluginOption, Update } from 'vite'
import { getHighlighter, type HighlighterOptions } from 'shiki'
import { remark } from 'remark'
import { remarkVue } from './remark'

export type MarkdownVuePreviewOptions = {
  highlighter?: (code: string) => string
  shiki?: HighlighterOptions
}
export type TransformOptions = { root: string; highlighter: (code: string) => string }

const VUE_CODE_REGEXP = /VueCode[a-z0-9]{8}I\d{1,4}\.vue$/
const vueBlockMap = new Map<string, string>()

const transformOptions: TransformOptions = {
  root: process.cwd(),
  highlighter: code => code,
}

export const transformer = (code: string, file: string) => {
  const ret = remark()
    .use(remarkVue, {
      file,
      root: transformOptions.root,
      highlighter: transformOptions.highlighter,
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

export function MarkdownVuePreview(options: MarkdownVuePreviewOptions = {}): PluginOption[] {
  const { highlighter, shiki: shikiOptions } = options

  const plugin: Plugin = {
    name: 'vite:md-vue',
    enforce: 'pre',
    async configResolved(config) {
      const shiki = await getHighlighter({
        theme: 'github-light',
        langs: ['vue'],
        ...shikiOptions,
      })
      transformOptions.highlighter =
        highlighter ||
        ((code: string) => {
          return shiki.codeToHtml(code, { lang: 'vue' })
        })
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

export default MarkdownVuePreview
