<p>
  <a href="https://www.npmjs.com/package/vite-plugin-md-preview" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/vite-plugin-md-preview.svg">
  </a>
  <a href="https://www.npmjs.com/package/vite-plugin-md-preview" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/dt/vite-plugin-md-preview">
  </a>
</p>

# vite-plugin-md-preview

markdown 代码块预览插件, 在 markdown 文件中使用 \`\`\` 代码块为组件编写 demo 。

本插件需要与 [vite-plugin-md](https://github.com/antfu/vite-plugin-md) 结合使用，为 markdown 提供 vue 代码块预览能力。

示例：[https://vite-plugin-md-preview.vercel.app](https://vite-plugin-md-preview.vercel.app)

## 重要改动

> 原 `vite-plugin-vuedoc` 重命名为 `vite-plugin-md-preview`
> 移除了 markdown 解析能力，改为与 `vite-plugin-md` 结合使用的方式。

## 特性

- [x] Markdown Vue 代码块预览
- [x] 自定义预览组件，自定义展示样式
- [x] 支持热更新

## 使用

### 安装

```bash
npm i vite-plugin-md vite-plugin-md-preview -D
# or
yarn add vite-plugin-md vite-plugin-md-preview -D
```

配置 vite.config.ts

```js
import Vue from '@vitejs/plugin-vue'
import shiki from 'markdown-it-shiki'
import Markdown from 'vite-plugin-md'
import MarkdownPreview, { transformer } from 'vite-plugin-md-preview'

export default {
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/], // 需包含 .md 文件
    }),
    Markdown({
      transforms: {
        before: transformer, // -> 1. 为 vite-plugin-md 添加 transformer
      },
      markdownItSetup(md) {
        md.use(shiki, { theme: 'github-light' }) // 支持代码高亮
      },
    }),
    MarkdownPreview(), // -> 2. 添加插件
  ],
}
```

### 注册 `VueCode` 组件

插件并不包含 preview 组件的具体实现，开发者需自行实现 `VueCode` 并全局注册。

该组件包含一个 `slot` 以及接收一个名为 `source` 的 prop

示例：

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

注册为全局组件

```ts
const app = createApp(App)

app.component('VueCode', VueCode) // 必须的
app.mount('#app')
```

### 引入 markdown 文件

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

## 在 markdown 文件中使用代码块

带有 `preview` 标记的 vue 代码块支持实时预览

````markdown
# 这是一个 markdown 文件

## 下方是带有预览能力的代码快

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

## 代码高亮

`vite-plugin-md-preview` 中内置了 [shiki](https://github.com/antfu/markdown-it-shiki) 来支持代码高亮。

需要注意的是该选项并不处理 markdown 中其他非代码的高亮，可以通过在 `vite-plugin-md` 中添加 `markdown-it-shiki` 插件来保持一致。

```ts
import Vue from '@vitejs/plugin-vue'
import shiki from 'markdown-it-shiki'
import Markdown from 'vite-plugin-md'
import MarkdownPreview, { transformer } from 'vite-plugin-md-preview'

export default {
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/], // 需包含 .md 文件
    }),
    Markdown({
      transforms: {
        before: transformer,
      },
      markdownItUses: [[shiki, { theme: 'github-light' }]], // markdown 中其他代码的高亮
    }),
    MarkdownPreview({
      shiki: { theme: 'github-light' }, // 设置代码高亮主题
    }),
  ],
}
```

## License

MIT License © 2020-PRESENT [Jaskang](https://github.com/jsakang)

```

```
