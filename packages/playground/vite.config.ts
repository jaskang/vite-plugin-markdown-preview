import { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createPlugin, vueDocFiles } from 'vite-plugin-vuedoc'

const config: UserConfig = {
  plugins: [
    createPlugin({
      highlight: {
        theme: 'one-dark'
      }
    }),
    vue({
      include: [...vueDocFiles]
    }),
    vueJsx()
  ]
}

export default config
