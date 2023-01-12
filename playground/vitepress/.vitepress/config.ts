import { defineConfig } from 'vitepress'
import vueJsx from '@vitejs/plugin-vue-jsx'
import MdPreview from 'vite-plugin-markdown-preview'

export default defineConfig({
  lang: 'zh-CN',
  title: 'vite-plugin-markdown-preview',
  description: 'vite-plugin-markdown-preview vitepress playground',
  vite: {
    publicDir: 'public',
    plugins: [vueJsx(), MdPreview()],
  },
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present jaskang',
    },
  },
})
