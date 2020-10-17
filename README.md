<p>
  <a href="https://www.npmjs.com/package/vite-plugin-vuedoc" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/vite-plugin-vuedoc.svg">
  </a>
</p>

# vite-plugin-vuedoc

A markdown & vue preview plugin for vite.

## Feature

- [x] markdown file
- [x] vue demo preview
- [x] vue demo source
- [ ] add tests
- [ ] add playground
- [ ] sourcemap
- [ ] better hmr
- [ ] support highlight options
- [ ] gray-matter

## Install

```sh
yarn add vite-plugin-vuedoc
```

## Options

```typescript
type VueDocPluginOptions = {
  wrapperClass: string
  previewClass: string
  markdownPlugins: any[]
}
```

- wrapperClass default: ''
  > classname wrapped markdown file
- previewClass default: ''
  > classname wrapped vuedemo
- markdownPlugins default: []
  > markdown-it plugins

## Quick Start

#### use vite-plugin-vuedoc

```typescript
// vite.config.ts
import type { UserConfig } from 'vite'
import vitePluginVuedoc from 'vite-plugin-vuedoc'

const config: UserConfig = {
  plugins: [vitePluginVuedoc()]
}

export default config
```

#### import style

> import 'vite-plugin-vuedoc/style.css'

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import 'vite-plugin-vuedoc/style.css'

const app = createApp(App)
app.mount('#app')
```

#### markdown doc

![markdown doc](https://github.com/JasKang/vite-plugin-vuedoc/blob/master/playground/assets/md.png?raw=true)

#### import markdown

```typescript
// router.ts
export const router = createRouter({
  routes: [
    { path: '/home', redirect: '/' },
    {
      path: '/button',
      name: 'button',
      component: async () => import('./docs/Button.zh-CN.md')
    }
  ]
})
```

## screenshots

![markdown doc](https://github.com/JasKang/vite-plugin-vuedoc/blob/master/playground/assets/vue.gif?raw=true)

> vue javascript

![markdown doc](https://github.com/JasKang/vite-plugin-vuedoc/blob/master/playground/assets/vue-js.gif?raw=true)
