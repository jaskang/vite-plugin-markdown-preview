<p>
  <a href="https://www.npmjs.com/package/vite-plugin-vuedoc" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/vite-plugin-vuedoc.svg">
  </a>
</p>

# vite-plugin-vuedoc

A markdown & vue preview plugin for vite.

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

- wrapperClass default: vuedoc
  > classname wrapped markdown file
- previewClass default: vuedoc-demo
  > classname wrapped vuedemo
- markdownPlugins default: []
  > markdown-it plugins

## Feature

- [] sourcemap
- [] better hmr
- [] support highlight options
- [] gray-matter

## Quick Start

- use vite-plugin-vuedoc

```typescript
// vite.config.ts
import type { UserConfig } from 'vite'
import vitePluginVuedoc from 'vite-plugin-vuedoc'

const config: UserConfig = {
  plugins: [vitePluginVuedoc()]
}

export default config
```

- import style

> import 'vite-plugin-vuedoc/style.css'

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import 'vite-plugin-vuedoc/style.css'

const app = createApp(App)
app.mount('#app')
```

- markdown doc

![markdown doc](https://github.com/JasKang/vite-plugin-vuedoc/blob/master/playground/assets/WX20201015-120206.png?raw=true)

- import markdown

```typescript
// router.ts
import { createRouter, createWebHistory } from 'vue-router'
import Layout from './components/Layout.vue'

export const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: [
    { path: '/home', redirect: '/' },
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: '/button',
          name: 'button',
          component: async () => import('./docs/Button.zh-CN.md')
        }
      ]
    }
  ]
})
```

- screenshots

![markdown doc](https://github.com/JasKang/vite-plugin-vuedoc/blob/master/playground/assets/WX20201015-120910.png?raw=true)

- show code

![markdown doc](https://github.com/JasKang/vite-plugin-vuedoc/blob/master/playground/assets/WX20201015-121156.png?raw=true)
