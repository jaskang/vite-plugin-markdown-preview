import { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vitePluginVuedoc from './src'

const config: UserConfig = {
  optimizeDeps: {
    auto: false,
    exclude: [
      '@vue/compiler-sfc',
      'fs-extra',
      'gray-matter',
      'highlight.js',
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
      'markdown-it-toc-and-anchor',
      'vue'
    ],
    include: []
  },
  plugins: [
    vitePluginVuedoc({
      highlight: {
        theme: 'one-dark'
      }
    }),
    vue(),
    vueJsx()
  ]
}

export default config
