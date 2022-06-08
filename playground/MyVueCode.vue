<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    source: {
      type: String,
      default: '',
    },
  },
})
</script>
<template>
  <div class="vue-code">
    <div class="vue-code__slot">
      <slot></slot>
    </div>
    <div class="vue-code__source" v-html="decodeURIComponent(source)"></div>
  </div>
</template>
<style scoped>
.vue-code {
  background-color: #fff;
  border: 10px solid #ddd;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 4px 4px 4px rgb(0 0 0 / 10%);
  display: flex;
}
.vue-code__slot {
  width: 200px;
  overflow: auto;
  padding: 10px;
  border-right: 5px dashed #ccc;
}
.vue-code__source {
  flex: 1;
  padding: 10px;
}
</style>
