import DefaultTheme from 'vitepress/theme'
import CodePreview from '../components/CodePreview.vue'
import '../styles/index.scss'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('MyCodePreview', CodePreview)
  },
}
