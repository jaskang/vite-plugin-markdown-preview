```vue
<template>test</template>
```

### vue preview

默认模式

```vue preview
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

### vue setup preview

支持 setup

```vue preview
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

### vue reactive preview

响应事件

```vue preview
<template>
  <div>num: {{ num }}</div>
  <div>
    <button type="primary" icon="el-icon-edit" @click="testclick">add</button>
    text: {{ text }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: 0,
      text: 'test',
    }
  },
  methods: {
    testclick() {
      this.num++
    },
  },
}
</script>
```

### css

支持 setup

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

### 不同的样式

搞个其他样式看看

```vue preview=MyVueCode
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

### highlight

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
