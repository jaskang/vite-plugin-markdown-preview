import { Plugin } from 'vite'
import { createMarkdownRenderFn } from './markdownToVue'
import createVuePlugin from '@vitejs/plugin-vue'
import { DemoBlockType } from './markdown-it'

const debug = require('debug')('vite:vuedoc:plugin')

export type VueDocPluginOptions = {
  wrapperClass: string
  previewClass: string
  previewComponent: string
  markdownIt: {
    plugins: any[]
  }
  highlight: {
    theme: 'one-dark' | 'one-light' | string
  }
}

const cacheDemos: Map<string, DemoBlockType[]> = new Map()

export function createVueDocPlugin(options: Partial<VueDocPluginOptions>) {
  const { wrapperClass = '', previewClass = '', previewComponent = '', markdownIt, highlight } = options
  const { plugins = [] } = markdownIt || {}
  const { theme = 'one-dark' } = highlight || {}
  const _options: VueDocPluginOptions = {
    wrapperClass,
    previewClass,
    previewComponent,
    markdownIt: {
      plugins
    },
    highlight: {
      theme
    }
  }
  const markdownToVue = createMarkdownRenderFn(_options)

  const vuePlugin = createVuePlugin({
    include: [/\.md$/, /\.vdpv_\d+$/]
  })

  const vueDocPlugin: Plugin = {
    name: 'vuedoc',
    config() {
      return {
        transformInclude: [/\.md$/, /\.vdpv_\d+$/]
      }
    },
    resolveId(id) {
      if (/\.vdpv_\d+$/.test(id)) {
        debug(`resolveId:${id}`)
        return id
      }
    },
    load(id) {
      const mat = id.match(/\.md\.vdpv_(\d+)$/)
      if (mat && mat.length >= 2) {
        const index: number = Number(mat[1])
        debug(`load:${id} ${index}`)
        const demoBlocks = cacheDemos.get(id.replace(`.vdpv_${index}`, ''))
        return demoBlocks?.[index].code
      }
    },
    transform(code, id) {
      if (id.endsWith('.md')) {
        debug(`transform:md -> ${id}`)
        // transform .md files into vueSrc so plugin-vue can handle it
        const { component, demoBlocks } = markdownToVue(code, id)
        cacheDemos.set(id, demoBlocks)
        return component
      }
    },
    async handleHotUpdate(ctx) {
      // handle config hmr
      const { file, read } = ctx

      // hot reload .md files as .vue files
      if (file.endsWith('.md')) {
        const content = await read()
        debug(`handleHotUpdate:md -> ${file}`)
        const { component, demoBlocks } = markdownToVue(content, file)
        cacheDemos.set(file, demoBlocks)
        // reload the content component
        return vuePlugin.handleHotUpdate!({
          ...ctx,
          read: () => component
        })
      }
    }
  }
  return [vueDocPlugin, vuePlugin]
}
