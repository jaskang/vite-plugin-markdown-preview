import fs from 'fs-extra'
import { Plugin } from 'rollup'
import { createMarkdownRenderFn, DemoType } from './markdownToVue'
import { VUEDOC_DEMO_RE } from './resolver'
import { VueDocPluginOptions } from '.'

const cacheDemos: Map<string, { component: any; demos: DemoType[] }> = new Map()

export function createVuedocBuildPlugin(options: VueDocPluginOptions): Plugin {
  const markdownToVue = createMarkdownRenderFn(options, true)
  return {
    name: 'vuedoc',
    resolveId(id) {
      if (VUEDOC_DEMO_RE.test(id)) {
        return id
      }
      return null
    },
    async load(id) {
      if (id.indexOf('?vue') === -1) {
        if (VUEDOC_DEMO_RE.test(id)) {
          const [, filepath, demoid] = VUEDOC_DEMO_RE.exec(id) || []
          const md = cacheDemos.get(filepath) || { component: '', demos: [] }
          const demo = md.demos.find(item => item.id === demoid)
          return demo?.code || ''
        }
        if (id.endsWith('.md')) {
          const content = await fs.readFile(id, 'utf-8')
          const { component, demos } = markdownToVue(content, id)
          cacheDemos.set(id, { component, demos })
          return component
        }
      }

      return null
    }
  }
}
