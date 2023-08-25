import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Shiki from 'markdown-it-shiki'
import Markdown from 'unplugin-vue-markdown/vite'
import { defineConfig } from 'vite'
import MarkdownPreview from 'vite-plugin-markdown-preview'

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
