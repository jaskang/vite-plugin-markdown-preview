import path from 'path'
import Markdown, { code, link, meta } from 'vite-plugin-md'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { document, viewPlugin, viteDocument } from './src'

const config = defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    viewPlugin(),
    Markdown({
      builders: [
        code({
          theme: 'base',
          layoutStructure: 'tabular',
        }),
        document(),
      ],
    }),
  ],
})

export default config
