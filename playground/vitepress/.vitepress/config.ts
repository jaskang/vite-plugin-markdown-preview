import { defineConfig } from 'vitepress'
import vueJsx from '@vitejs/plugin-vue-jsx'
import MarkdownPreview from 'vite-plugin-markdown-preview'

export default defineConfig({
  lang: 'zh-CN',
  title: 'vite-plugin-markdown-preview',
  description: 'vite-plugin-markdown-preview vitepress playground',
  vite: {
    publicDir: 'public',
    plugins: [vueJsx(), MarkdownPreview()],
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/JasKang/vite-plugin-markdown-preview' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present jaskang',
    },
  },
})
