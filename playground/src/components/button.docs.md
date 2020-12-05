---
title: sdfsa
dics: asdfs
wrapperClass: test-wrap
---

### vue preview

```vue demo
<template>
  <div>
    <el-button>button test</el-button>
    <el-button type="primary">primary button</el-button>
  </div>
</template>
```

### vue import preview

```vue demo file=./test.vue

```

### vue script import preview

```vue demo
<template>
  <div>
    <DmImport />
  </div>
</template>
<script>
import DmImport from './mdimport.vue'
export default {
  components: { DmImport }
}
</script>
```

### prism

code highlight

> demo need vue code wrapped

```typescript
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

```vue demo
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
