# playground-vitepress

_你好， {{ msg }}_

<RedDiv>

_当前计数为： {{ count }}_

</RedDiv>

<button @click="count++">点我！</button>

<script setup>
import { h, ref } from 'vue'

const RedDiv = (_, ctx) => h(
  'div',
  {
    class: 'red-div',
  },
  ctx.slots.default()
)
const msg = 'Markdown 中的 Vue'
const count = ref(0)
</script>

<style>
.red-div {
  color: red;
}
</style>

```ts
const Main = defineComponent({
  name: getCompName('Main'),
  setup(_, { slots }) {
    return () => <main class={blockCls}>{slots.default?.()}</main>
  },
})
```

### Code preview

```vue demo
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

```vue demo
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

```vue demo=VueCode1
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

```vue demo
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
