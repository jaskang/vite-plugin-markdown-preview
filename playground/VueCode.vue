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
  border: 1px solid #ccc;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 4px 4px 4px rgb(0 0 0 / 10%);
}
.vue-code__slot {
  width: 100%;
  overflow: auto;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.vue-code__source {
  padding: 10px;
}
</style>
