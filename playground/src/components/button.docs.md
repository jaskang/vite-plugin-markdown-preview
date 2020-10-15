# vite-plugin-vuedoc

demo preview

### Button

description

> demo need vue code wrapped

```vue
<template>
  <div>
    <el-button>button</el-button>
    <el-button type="primary">primary button</el-button>
  </div>
</template>
```

### Icon Button

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
