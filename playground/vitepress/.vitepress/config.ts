import { defineConfig } from 'vitepress'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VueDoc } from 'vite-plugin-vuedoc'

export default defineConfig({
  lang: 'zh-CN',
  title: 'vite-plugin-vuedoc',
  description: 'vite-plugin-vuedoc vitepress playground',
  vite: {
    plugins: [vueJsx(), VueDoc()],
  },
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present jaskang',
    },
  },
})
