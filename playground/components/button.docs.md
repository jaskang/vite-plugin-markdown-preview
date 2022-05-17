```vue
<template>test</template>
```

### vue preview

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

### highlight

code highlight

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
