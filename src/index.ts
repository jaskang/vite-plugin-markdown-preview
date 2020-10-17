import { Plugin } from 'vite'
import { createVuedocBuildPlugin } from './build'
import { createResolver } from './resolver'
import { createVuedocServerPlugin } from './server'

export type VueDocPluginOptions = {
  wrapperClass: string
  previewClass: string
  markdownPlugins: any[]
}

export default function createVueDocPlugin(options: Partial<VueDocPluginOptions> = {}): Plugin {
  const { wrapperClass = '', previewClass = '', markdownPlugins = [] } = options
  const _options: VueDocPluginOptions = {
    wrapperClass: `vuedoc ${wrapperClass}`,
    previewClass: `vuedoc-demo ${previewClass}`,
    markdownPlugins
  }
  return {
    resolvers: [createResolver()],
    configureServer: [createVuedocServerPlugin(_options)],
    rollupPluginVueOptions: {
      include: /\.(vue|md)$/
    },
    rollupInputOptions: {
      // @ts-ignore
      plugins: [createVuedocBuildPlugin(_options)]
    }
  }
}
