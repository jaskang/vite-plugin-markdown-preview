import { UserConfig } from 'vite'
import vitePluginVuedoc from './src'

const config: UserConfig = {
  entry: './playground/index.ts',
  optimizeDeps: {
    exclude: [
      'fs-extra',
      'highlight.js',
      'highlightjs-vue',
      'js-yaml',
      'markdown-it',
      'markdown-it-abbr',
      'markdown-it-container',
      'markdown-it-deflist',
      'markdown-it-emoji',
      'markdown-it-footnote',
      'markdown-it-ins',
      'markdown-it-katex',
      'markdown-it-latex',
      'markdown-it-mark',
      'markdown-it-source-map',
      'markdown-it-sub',
      'markdown-it-sup',
      'markdown-it-task-lists',
      'markdown-it-toc-and-anchor'
    ]
  },
  plugins: [
    vitePluginVuedoc({
      highlight: {
        theme: 'one-dark'
      }
    })
  ]
}

export default config
