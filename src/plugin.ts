import type { Plugin, PluginOption, Update } from 'vite'

const CODE_VUE_REGEXP = /MarkdownCodeVue[a-z0-9]{8}I\d{1,4}\.vue$/

export function markdownPreview(vueBlockMap: Map<string, string>): Plugin {
  let envType: 'default' | 'vitepress' | 'vuepress' = 'default'

  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'markdown-preview',
    enforce: 'pre',
    async configResolved(config) {
      const isVitepress = config.plugins.find(p => p.name === 'vitepress')
      const isVuepress = config.plugins.find(p => p.name === 'vuepress')
      envType = isVitepress ? 'vitepress' : isVuepress ? 'vuepress' : 'default'
    },
    resolveId(id) {
      if (CODE_VUE_REGEXP.test(id)) {
        return `${id}`
      }
    },
    load(id) {
      if (CODE_VUE_REGEXP.test(id)) {
        const code = vueBlockMap.get(id)
        return code
      }
    },
  }
}
