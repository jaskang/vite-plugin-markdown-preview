import '../styles/index.scss'

import DefaultTheme from 'vitepress/theme'

import CodePreview from '../components/CodePreview.vue'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('MyCodePreview', CodePreview)
  },
}
