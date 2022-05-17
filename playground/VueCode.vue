<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    source: String
  },
  setup(props) {
    const code = computed(() => decodeURI(props.source || ''));
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
