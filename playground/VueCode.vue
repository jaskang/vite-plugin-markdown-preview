<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    source: String
  },
  setup(props) {
    const code = computed(() => decodeURIComponent(props.source));
    console.log(code);
    return { code };
  }
});
</script>
<template>
  <slot></slot>
  <div>
    {{ code }}
  </div>
</template>
