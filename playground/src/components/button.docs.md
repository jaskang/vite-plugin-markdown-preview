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
  <div>
    <el-button type="primary" icon="el-icon-edit" @click="testclick"></el-button>
    <el-button type="primary" icon="el-icon-share"></el-button>
    <el-button type="primary" icon="el-icon-delete"></el-button>
  </div>
</template>
<script>
export default {
  methods: {
    testclick() {
      alert('testclick111222')
    }
  }
}
</script>
```

### Attributes

| 参数 | 说明 | 类型   | 可选值                                             | 默认值 |
| ---- | ---- | ------ | -------------------------------------------------- | ------ |
| size | 尺寸 | string | medium / small / mini                              | —      |
| type | 类型 | string | primary / success / warning / danger / info / text | —      |
