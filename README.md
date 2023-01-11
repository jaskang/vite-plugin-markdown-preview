<p>
  <a href="https://www.npmjs.com/package/vite-plugin-md-preview" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/vite-plugin-md-preview.svg">
  </a>
  <a href="https://www.npmjs.com/package/vite-plugin-md-preview" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/dt/vite-plugin-md-preview">
  </a>
</p>

# vite-plugin-md-preview

Markdown code block preview plugin, write component demo in markdown using \```.

This plugin needs to be used in combination with [vite-plugin-md](https://github.com/antfu/vite-plugin-md) to provide vue block preview capability for markdown.

Example: [https://vite-plugin-md-preview.vercel.app](https://vite-plugin-md-preview.vercel.app)

[中文文档](./README.zh-CN.md)

## Breaking Change

> Rename former `vite-plugin-md-preview` to `vite-plugin-md-preview`
> Removed markdown parsing capability and used it in combination with `vite-plugin-md`.

## Features

- [x] Markdown Vue code block preview
- [x] Custom preview component, custom display style
- [x] Hot update support

## Use

### Installation

```bash
npm i vite-plugin-md vite-plugin-md-preview -D
# or
yarn add vite-plugin-md vite-plugin-md-preview -D
```

vite.config.ts

```js
import Vue from '@vitejs/plugin-vue'
import shiki from 'markdown-it-shiki'
import Markdown from 'vite-plugin-md'
import MarkdownPreview, { transformer } from 'vite-plugin-md-preview'

export default {
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/], // Need to include .md files
    }),
    Markdown({
      transforms: {
        before: transformer, // -> 1. add transformer to vite-plugin-md
      },
      markdownItSetup(md) {
        md.use(shiki, { theme: 'github-light' }) // Support code highlighting
      },
    }),
    MarkdownPreview(), // -> 2. Add plugins
  ],
}
```

### Register the `VueCode` component

The plugin does not contain a concrete implementation of the preview component, developers need to implement `VueCode` and register it global.

This component have a `slot` and receives a prop named `source`

Example：

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    source: { type: String, default: '' },
  },
})
</script>
<template>
  <div class="demo">
    <div class="demo__preview">
      <slot></slot>
    </div>
    <div class="demo__source" v-html="decodeURIComponent(source)"></div>
  </div>
</template>
```

Register as a global component

```ts
const app = createApp(App)

app.component('VueCode', VueCode) // 必须的
app.mount('#app')
```

### import the markdown file

```vue
<template>
  <HelloWorld />
</template>

<script>
import HelloWorld from './README.md'

export default {
  components: {
    HelloWorld,
  },
}
</script>
```

## Using code blocks in markdown files

带有 `preview` 标记的 vue 代码块支持实时预览

````markdown
# This is a markdown file

## Below is the code with preview capability

```vue preview
<template>
  <div>
    <button @click="click">button</button>
  </div>
</template>
<script setup>
const click = () => {
  alert('a')
}
</script>
```
````

## Highlight

`vite-plugin-md-preview` has [shiki](https://github.com/antfu/markdown-it-shiki) built in to support code highlighting.

Note that this option does not handle other non-code highlighting in markdown, and can be made consistent by adding the `markdown-it-shiki` plugin to `vite-plugin-md`.

```ts
import Vue from '@vitejs/plugin-vue'
import shiki from 'markdown-it-shiki'
import Markdown from 'vite-plugin-md'
import MarkdownPreview, { transformer } from 'vite-plugin-md-preview'

export default {
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/], // Need to include .md files
    }),
    Markdown({
      transforms: {
        before: transformer,
      },
      markdownItUses: [[shiki, { theme: 'github-light' }]], // markdown code highlighting
    }),
    MarkdownPreview({
      shiki: { theme: 'github-light' }, // Code highlighting
    }),
  ],
}
```

## License

MIT License © 2020-PRESENT [Jaskang](https://github.com/jsakang)
