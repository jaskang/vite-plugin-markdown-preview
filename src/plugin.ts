import { ModuleNode, Plugin, ResolvedConfig } from 'vite'
import { createMarkdownRenderFn } from './markdownToVue'
import createVuePlugin from '@vitejs/plugin-vue'
import { DemoBlockType } from './markdown-it'
import path from 'path'

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

  const vuePlugin = createVuePlugin({
    include: [/\.md$/, /\.vdpv_\d+$/]
  })
  let config: ResolvedConfig
  const vueDocPlugin: Plugin = {
    name: 'vuedoc',
    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig
    },
    config() {
      return {
        transformInclude: [/\.md$/, /\.vdpv_\d+$/]
      }
    },
    resolveId(id) {
      if (/\.vdpv_\d+$/.test(id)) {
        return id
      }
    },
    load(id) {
      const mat = id.match(/\.md\.vdpv_(\d+)$/)
      if (mat && mat.length >= 2) {
        const index: number = Number(mat[1])
        debug(`load:${id} ${index}`)
        const mdFileName = id.replace(`.vdpv_${index}`, '')
        const mdFilePath = mdFileName.startsWith(config.root + '/')
          ? mdFileName
          : path.join(config.root, mdFileName.substr(1))

        const demoBlocks = cacheDemos.get(mdFilePath)
        return demoBlocks?.[index].code
      }
    },
    transform(code, id) {
      if (id.endsWith('.md')) {
        const filePath = id.startsWith(config.root + '/') ? id : path.join(config.root, id.substr(1))
        debug(`transform:md -> ${filePath}`)
        debug(`transform:config -> ${config.root}`)
        const markdownToVue = createMarkdownRenderFn(_options, config)
        const { component, demoBlocks } = markdownToVue(code, filePath)
        cacheDemos.set(filePath, demoBlocks)
        return component
      }
    },
    async handleHotUpdate(ctx) {
      // handle config hmr
      const { file, read, timestamp, server } = ctx
      const { moduleGraph } = server
      // hot reload .md files as .vue files
      if (file.endsWith('.md')) {
        const content = await read()
        debug(`handleHotUpdate:md -> ${file}`)
        const markdownToVue = createMarkdownRenderFn(_options, config)
        const { component, demoBlocks } = markdownToVue(content, file)
        const prevDemoBlocks = [...(cacheDemos.get(file) || [])]
        cacheDemos.set(file, demoBlocks)
        const updateModules: ModuleNode[] = []
        //     file: string;
        // timestamp: number;
        // modules: Array<ModuleNode>;
        // read: () => string | Promise<string>;
        // server: ViteDevServer;
        demoBlocks.forEach(async (demo, index) => {
          const prevDemo = prevDemoBlocks?.[index]
          if (!prevDemo || demo.id != prevDemo.id || demo.code !== prevDemo.code) {
            const demoFile = `${file}.${demo.id}`
            debug(`handleHotUpdate:demo -> ${demoFile}`)
            const mods = moduleGraph.getModulesByFile(demoFile)
            const ret = await vuePlugin.handleHotUpdate!({
              file: demoFile,
              timestamp: timestamp,
              modules: mods ? [...mods] : [],
              server: server,
              read: () => component
            })
            if (ret) {
              debug('ret:', ret)
              updateModules.push(...ret)
            }
            // watcher.emit('change', demoFile)
          }
        })
        // reload the content component

        // id: '/Users/jaskang/GitHub/vite-plugin-vuedoc/playground/components/button.docs.md',
        // file: '/Users/jaskang/GitHub/vite-plugin-vuedoc/playground/components/button.docs.md',
        // importers: Set(1) { [ModuleNode] },
        // importedModules: Set(5) {
        //   [ModuleNode],
        //   [ModuleNode],
        //   [ModuleNode],
        //   [ModuleNode],
        //   [ModuleNode]
        // },
        // acceptedHmrDeps: Set(0) {},
        // isSelfAccepting: true,
        // transformResult: null,
        // lastHMRTimestamp: 1609931154134,
        // url: '/playground/components/button.docs.md',
        // type: 'js'
        const ret = await vuePlugin.handleHotUpdate!({
          ...ctx,
          read: () => component
        })
        return [...updateModules, ...(ret || [])]
      }
    }
  }
  return [vueDocPlugin, vuePlugin]
}
