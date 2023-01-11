<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  props: {
    code: { type: String, required: true },
    lang: { type: String, required: true },
    meta: { type: String, required: true },
  },
  setup() {
    return {}
  },
})
</script>
<template>
  <div class="vue-code">
    <div class="vue-code__attr">
      <h3>props:</h3>
      <ul>
        <li>lang: {{ lang }}</li>
        <li>meta: {{ meta }}</li>
        <li>code: {{ code }}</li>
      </ul>
    </div>
    <div class="vue-code__slot">
      <h3>default slot:</h3>
      <slot></slot>
    </div>
    <div class="vue-code__code">
      <h3>code slot:</h3>
      <div class="vue-code__source">
        <slot name="code"></slot>
      </div>
    </div>
  </div>
</template>
<style scoped>
.vue-code {
  background-color: #fff;
  border: 4px solid #ccc;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 4px 4px 4px rgb(0 0 0 / 10%);
}
.vue-code h3 {
  margin: 0 0 1rem 0;
}
.vue-code__attr {
  padding: 1rem;
  border-bottom: 4px solid #ccc;
}
.vue-code__slot {
  width: 100%;
  overflow: auto;
  padding: 1rem;
  border-bottom: 4px solid #ccc;
}
.vue-code__code {
  padding: 1rem;
}
</style>
