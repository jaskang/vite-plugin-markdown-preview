import { UserConfig } from 'vite'
import vitePluginVuedoc from './src'

const config: UserConfig = {
  entry: './playground/index.ts',
  optimizeDeps: {
    exclude: ['fs-extra', 'highlight.js', 'js-yaml', 'markdown-it']
  },
  plugins: [
    vitePluginVuedoc({
      prism: {
        theme: 'okaidia'
      }
    })
  ]
}

export default config
