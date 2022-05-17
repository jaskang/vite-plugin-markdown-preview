import type { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Markdown from 'vite-plugin-md'
import MarkdownVue, { transformer } from './src'

const config: UserConfig = {
  build: {
    outDir: 'playground/dist',
    emptyOutDir: true,
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
    Markdown({
      transforms: {
        before: transformer,
      },
    }),
    MarkdownVue(),
  ],
}

export default config
