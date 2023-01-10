# playground-vite

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
