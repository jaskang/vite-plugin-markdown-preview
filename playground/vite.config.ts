import { UserConfig } from 'vite'
import vitePluginVuedoc from 'vite-plugin-vuedoc'
const config: UserConfig = {
  plugins: [
    vitePluginVuedoc({
      prism: {
        theme: 'okaidia'
      }
    })
  ]
}

export default config
