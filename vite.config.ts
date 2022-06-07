import path from 'path'
import Markdown, { code } from 'vite-plugin-md'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { document, plugin as Document } from './src'

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
    Document(),
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
