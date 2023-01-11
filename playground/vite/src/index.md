# playground-vite

### Code preview

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

### Setup mode preview

```vue preview
<template>
  <div>当前计数为：{{ count }} <button @click="count++">点我！</button></div>
</template>
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
```

### Custom preview theme

```vue preview=VueCode
<template>
  <div class="btn">当前计数为：{{ count }} <button @click="count++">点我！</button></div>
</template>
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
<style scoped>
.btn {
  color: red;
}
</style>
```
