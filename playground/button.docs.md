```ts
const Main = defineComponent({
  name: getCompName('Main'),
})
```

### Code preview

```vue
<template>
  <div>
    <button @click="click">alert button</button>
  </div>
</template>
<script>
export default {
  methods: {
    click() {
      alert('a')
    },
  },
}
</script>
```

### Setup mode preview

```vue
<template>
  <div>
    <button @click="click">setup alert button</button>
  </div>
</template>
<script setup>
const click = () => {
  alert('a')
}
</script>
```

### Custom preview theme

```vue preview=VueCode1
<template>
  <div>
    <button class="btn">蓝字按钮</button>
  </div>
</template>
<style scoped>
.btn {
  color: blue;
}
</style>
```

### style sure

```vue preview
<template>
  <div>
    <button class="btn">蓝字按钮</button>
  </div>
</template>
<style scoped>
.btn {
  color: blue;
}
</style>
```

### Other code highlight

`vite-plugin-md` 其他代码高亮

```ts
import { App, defineComponent } from 'vue'
import { getBlockCls, getCompName } from '@/config'

const blockCls = getBlockCls('Main')

const Main = defineComponent({
  name: getCompName('Main'),
  setup(_, { slots }) {
    return () => <main class={blockCls}>{slots.default?.()}</main>
  },
})

Main.install = (app: App): void => {
  app.component(Main.name, Main)
}

export default Main
```
