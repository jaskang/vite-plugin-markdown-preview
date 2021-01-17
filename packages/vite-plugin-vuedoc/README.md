<p>
  <a href="https://www.npmjs.com/package/vite-plugin-vuedoc" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/vite-plugin-vuedoc.svg">
  </a>
</p>

# vite-plugin-vuedoc

- Use Markdown as Vue components
- Use Markdown Code Block as Preview components
- Support vite 2

## vite 1.X

vite 1 use vite-plugin-vuedoc 2.0 [https://github.com/JasKang/vite-plugin-vuedoc/tree/2.0.0]

## Feature

- [x] markdown components
  - [x] matter
  - [x] toc
  - [x] plugins
- [x] vue code block
  - [x] vue preview
  - [x] code import
  - [x] customizing the preview component
  - [x] sourcemap
- [x] code highlight
  - [x] theme
- [x] playground
- [x] hmr
- [ ] tests

## Used

- Elenext: [elenext.vercel.app](https://elenext.vercel.app)

## Install

```sh
yarn add vite-plugin-vuedoc
```

```typescript
// vite.config.ts
import vitePluginVuedoc from 'vite-plugin-vuedoc'
import vue from '@vitejs/plugin-vue'

const config: UserConfig = {
  plugins: [vitePluginVuedoc(), vue()]
}

export default config
```

import style

```
import 'vite-plugin-vuedoc/style.css'
```

## VueDocPluginOptions

- wrapperClass: string
  > The classname of the wrapped markdown component
- previewClass: string
  > The classname of the wrapped preview component
- previewComponent: string
  > The name of the custom preview component you want to use
- markdownIt:
  - plugins: any[]
    > markdownIt plugins
- highlight:
  - theme: 'one-dark' | 'one-light' | string
    > highlight theme. defalut: one-dark

#### import markdown

```typescript
import MdComp from './docs/Button.zh-CN.md'
export const router = createRouter({
  routes: [
    { path: '/home', redirect: '/' },
    {
      path: '/button',
      name: 'button',
      component: MdComp
    }
  ]
})
```

## VueBlock preview

when the vue code block has a `demo` tag， it can preview the component

\`\`\`vue demo

\`\`\`

## code block import

in code block support import file like this:

\`\`\`vue demo src="./test.vue"

\`\`\`

\`\`\`typescript src="./test.ts"

\`\`\`

## Frontmatter & Toc

```
// Button.zh-CN.md
---
wrapperClass: '' // wrapperClass will wrapped current md file
title: 'title'
desc: 'desc'
---
```

```typescript
import MdComp from './docs/Button.zh-CN.md'

const { matter, toc } = MdComp.$vd
console.log(matter)
console.log(toc)
// matter: {wrapperClass, title, desc}
// toc: [{content: string; anchor: string; level: number},{content: string; anchor: string; level: number}]
```

## Custom Preview Component

```typescript
// vite.config.ts
import vitePluginVuedoc from 'vite-plugin-vuedoc'

const config: UserConfig = {
  plugins: [
    vitePluginVuedoc({
      previewComponent: 'myDemoPreview'
    })
  ]
}

export default config
```

register your components in you vite app

```
app.component('myDemoPreview', myDemoPreview)
```

myDemoPreview

```vue
<template>
  <slot> -> // Demo Component
  <slot name="code"> -> // code block html
</template>
<script>
export defalut {
  prop:{
    lang: String
    theme: String
  }
}
</script>
```

## Markdown Screenshots

![markdown doc](https://github.com/JasKang/vite-plugin-vuedoc/blob/master/packages/playground/src/assets/main.png?raw=true)

## Preview Screenshots

![markdown doc](https://github.com/JasKang/vite-plugin-vuedoc/blob/master/packages/playground/src/assets/vue.gif?raw=true)

> vue javascript

![markdown doc](https://github.com/JasKang/vite-plugin-vuedoc/blob/master/packages/playground/src/assets/vue-js.gif?raw=true)
