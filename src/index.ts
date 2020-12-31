import { Plugin } from 'vite'
import { createVuedocBuildPlugin } from './build'
import { createVuedocServerPlugin } from './server'

export type VueDocPluginOptions = {
  wrapperClass: string
  previewClass: string
  previewComponent: string
  markdownIt: {
    plugins: any[]
    containers: string[]
  }
  highlight: {
    theme: 'one-dark' | 'one-light' | string
  }
}

export default function createVueDocPlugin(options: Partial<VueDocPluginOptions> = {}): Plugin {
  const { wrapperClass = '', previewClass = '', previewComponent = '', markdownIt, highlight } = options
  const { plugins = [], containers = [] } = markdownIt || {}
  const { theme = 'one-dark' } = highlight || {}
  const _options: VueDocPluginOptions = {
    wrapperClass,
    previewClass,
    previewComponent,
    markdownIt: {
      plugins,
      containers
    },
    highlight: {
      theme
    }
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
