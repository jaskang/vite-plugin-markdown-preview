import { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vitePluginVuedoc from 'vite-plugin-vuedoc'

const config: UserConfig = {
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
