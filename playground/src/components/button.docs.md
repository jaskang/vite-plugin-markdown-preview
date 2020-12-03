---
title: sdfsa
dics: 'asdfs'
---

<div>div</div>
# vite-plugin-vuedoc

demo preview
:+1:

### vue primary

```vue demo
<template>
  <div>
    <el-button>button</el-button>
    <el-button type="primary">primary button</el-button>
  </div>
</template>
```

### vue primary import

```vue demo file=./test.vue

```

### typescript

description

> demo need vue code wrapped

```typescript test
import { App, defineComponent } from 'vue'
import { getBlockCls, getCompName } from '@/config'

const blockCls = getBlockCls('Main')

const Main = defineComponent({
  name: getCompName('Main'),
  setup(_, { slots }) {
    return () => <main class={blockCls}>{slots.default?.()}</main>
  }
})

Main.install = (app: App): void => {
  app.component(Main.name, Main)
}

export default Main
```

### Icon `Button`

description

> demo need vue code wrapped

```vue
<template>
  <div>num: {{ num }}</div>
  <div>
    <el-button type="primary" icon="el-icon-edit" @click="testclick">add</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: 0
    }
  },
  methods: {
    testclick() {
      this.num++
    }
  }
}
</script>
```

### Attributes
