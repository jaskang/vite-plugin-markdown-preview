import { Plugin } from 'vite'
import { createVuedocBuildPlugin } from './build'
import { createVuedocServerPlugin } from './server'

export type VueDocPluginOptions = {
  wrapperClass: string
  previewClass: string
  markdownItPlugins: any[]
  prism: {
    theme: 'default' | 'coy' | 'dark' | 'funky' | 'okaidia' | 'solarizedlight' | 'tomorrow' | 'twilight' | 'custom'
  }
}

export default function createVueDocPlugin(options: Partial<VueDocPluginOptions> = {}): Plugin {
  const { wrapperClass = '', previewClass = '', markdownItPlugins = [], prism = { theme: 'default' } } = options
  const _options: VueDocPluginOptions = {
    wrapperClass,
    previewClass,
    markdownItPlugins,
    prism
  }
  return {
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
