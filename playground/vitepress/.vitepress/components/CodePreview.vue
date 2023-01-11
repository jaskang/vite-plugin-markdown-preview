<script setup lang="ts">
import { h, ref } from 'vue'
const props = defineProps({
  code: { type: String, required: true },
  lang: { type: String, required: true },
  meta: { type: String, required: true },
})
</script>
<template>
  <div class="my-code-preview">
    <div class="my-code-preview__slot">
      <slot></slot>
    </div>
    <div class="my-code-preview__code">
      <slot name="code"></slot>
    </div>
  </div>
</template>
<style lang="scss">
.my-code-preview {
  display: flex;
  border: 4px solid #ccc;
}
.my-code-preview__slot {
  flex: 1;
  padding: 1rem;
  overflow: hidden;
  border-right: 4px solid #ccc;
}
.my-code-preview__code {
  flex: 1;
  overflow: hidden;
}
.my-code-preview__code div[class*='language-'] {
  margin: 0;
  border-radius: 0;
}
.my-code-preview__code div[class*='language-'] pre {
  /* total width */
  &::-webkit-scrollbar {
    background-color: transparent;
    width: 6px;
    height: 6px;
  }

  /* background of the scrollbar except button or resizer */
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar-track:hover {
    background-color: transparent;
  }

  /* scrollbar itself */
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  /* set button(top and bottom of the scrollbar) */
  &::-webkit-scrollbar-button {
    display: none;
  }
}
</style>
