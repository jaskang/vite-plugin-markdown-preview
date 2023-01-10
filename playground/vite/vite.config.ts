import { defineConfig } from 'vite'
import Markdown from 'vite-plugin-vue-markdown'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import VueDoc from 'vite-plugin-vuedoc'

const config = defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/], // <--
    }),
    VueJsx(),
    Markdown(),
    VueDoc(),
  ],
})

export default config
