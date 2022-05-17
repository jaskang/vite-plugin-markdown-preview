<p>
  <a href="https://www.npmjs.com/package/vite-plugin-md-vue" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/vite-plugin-md-vue.svg">
  </a>
  <a href="https://www.npmjs.com/package/vite-plugin-md-vue" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/dt/vite-plugin-md-vue">
  </a>
</p>

# vite-plugin-md-vue

Markdown Vue Code Block Preview

> 本插件需要与 `vite-plugin-md` 结合使用，为 `vite-plugin-md` 提供 vue 代码块预览能力。

# 新版本

> 原 `vite-plugin-vuedoc` 重命名为 `vite-plugin-md-vue`
> 移除了 markdown 解析能力，改为与 `vite-plugin-md` 结合使用的方式。

## 特性

- [x] Markdown Vue 代码块预览
- [x] 自定义预览组件
- [x] 支持热更新

## 使用

```bash
npm i vite-plugin-md vite-plugin-md-vue -D
# or
yarn add vite-plugin-md vite-plugin-md-vue -D
```

then add the following to vite.config.ts

```js
import Vue from '@vitejs/plugin-vue';
import Markdown from 'vite-plugin-md';
import MarkdownVue, { transform } from 'vite-plugin-md-vue';

export default {
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Markdown({
      transforms: {
        before: transform
      }
    }),
    MarkdownVue()
  ]
};
```

And import it as a normal Vue component

## Import Markdown as Vue components

```vue
<template>
  <HelloWorld />
</template>

<script>
import HelloWorld from './README.md';

export default {
  components: {
    HelloWorld
  }
};
</script>
```

## Use Vue Code Block inside Markdown

You can even use Vue code inside your markdown, for example

```vue
<template>
  <div>
    <button @click="click">button</button>
  </div>
</template>
<script setup>
const click = () => {
  alert('a');
};
</script>
```

## License

MIT License © 2020-PRESENT [Jaskang](https://github.com/jsakang)
