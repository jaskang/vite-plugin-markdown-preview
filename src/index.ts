import { Plugin } from 'vite'
import { createVuedocBuildPlugin } from './build'
import { createResolver } from './resolver'
import { createVuedocServerPlugin } from './server'

export type VueDocPluginOptions = {
  wrapperClass: string
  previewClass: string
  markdownPlugins: any[]
  prism: {
    theme: 'default' | 'coy' | 'dark' | 'funky' | 'okaidia' | 'solarizedlight' | 'tomorrow' | 'twilight' | 'custom'
  }
}

export default function createVueDocPlugin(options: Partial<VueDocPluginOptions> = {}): Plugin {
  const { wrapperClass = '', previewClass = '', markdownPlugins = [], prism = { theme: 'default' } } = options
  const _options: VueDocPluginOptions = {
    wrapperClass,
    previewClass,
    markdownPlugins,
    prism
  }
  return {
    resolvers: [createResolver()],
    configureServer: [createVuedocServerPlugin(_options)],
    // @ts-ignore
    rollupPluginVueOptions: {
      include: /\.(vue|md)$/
    },
    rollupInputOptions: {
      // @ts-ignore
      plugins: [createVuedocBuildPlugin(_options)]
    }
  }
}
