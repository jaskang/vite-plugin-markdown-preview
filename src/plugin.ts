import type { Plugin, PluginOption, Update } from 'vite'

const VUE_CODE_REGEXP = /VueCode[a-z0-9]{8}I\d{1,4}\.vue$/

export function viteDocument(vueBlockMap: Map<string, string>): PluginOption {
  const plugin: Plugin = {
    name: 'vite:md-document',
    enforce: 'pre',
    async configResolved(config) {
      console.log('md-document configResolved')

      // const shiki = await getHighlighter({
      //   theme: 'github-light',
      //   langs: ['vue'],
      //   ...shikiOptions,
      // })
      // transformOptions.highlighter =
      //   highlighter ||
      //   ((code: string) => {
      //     return shiki.codeToHtml(code, { lang: 'vue' })
      //   })
      // transformOptions.root = config.root
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

  return plugin
}
