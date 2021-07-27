import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createPlugin, vueDocFiles } from 'vite-plugin-vuedoc'

export default defineConfig({
  plugins: [
    createPlugin(),
    vue({
      include: [...vueDocFiles]
    }),
    vueJsx()
  ]
})
