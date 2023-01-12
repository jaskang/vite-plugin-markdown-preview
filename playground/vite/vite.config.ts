import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Markdown from 'vite-plugin-vue-markdown'
import MarkdownPreview from 'vite-plugin-markdown-preview'

import Shiki from 'markdown-it-shiki'

const config = defineConfig({
  plugins: [
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
    MarkdownPreview(),
  ],
})

export default config
