import { defineUserConfig } from 'vuepress'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VueDocVuepress } from 'vite-plugin-vuedoc'
import Inspect from 'vite-plugin-inspect'

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'vite-plugin-vuedoc',
  description: '这是我的第一个 VuePress 站点',
  plugins: [
    VueDocVuepress,
    {
      name: 'vuepress-plugin-inspect',
      extendsBundlerOptions: (bundlerOptions, app) => {
        // 修改 @vuepress/bundler-vite 的配置项
        if (app.options.bundler.name === '@vuepress/bundler-vite') {
          bundlerOptions.viteOptions ??= {}
          bundlerOptions.viteOptions.plugins ??= []
          bundlerOptions.viteOptions.plugins.push(Inspect())
        }
      },
    },
  ],
})
