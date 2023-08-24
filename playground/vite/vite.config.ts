import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Markdown from 'unplugin-vue-markdown/vite'
import MarkdownPreview from 'vite-plugin-markdown-preview'

import Shiki from 'markdown-it-shiki'

const config = defineConfig({
  plugins: [
    MarkdownPreview(), 
    Vue({
      include: [/\.vue$/, /\.md$/], // <--
    }),
    VueJsx(),
    Markdown({
      markdownItSetup(md) {
        md.use(Shiki, {
          theme: 'github-light',
        })
      },
    }),
  ],
})

export default config
