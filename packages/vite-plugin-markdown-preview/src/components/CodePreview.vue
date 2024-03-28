<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CodePreview',
  props: {
    code: { type: String, required: true },
    lang: { type: String, required: true },
    meta: { type: String, required: true },
  },
  setup(props) {
    const codeEl = ref()
    const height = ref(0)
    const copied = ref(false)
    const toggleCode = () => {
      const targetHeight = codeEl.value ? codeEl.value.offsetHeight : 0
      height.value = height.value === 0 ? targetHeight : 0
    }
    const copyCode = () => {
      if (!copied.value) {
        try {
          navigator.clipboard.writeText(props.code)
        } catch (err) {
          console.log(err)
        }
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 1000)
      }
    }
    return {
      codeEl,
      height,
      copied,
      toggleCode,
      copyCode,
    }
  },
})
</script>
<template>
  <div :class="['mdp-demo', height > 0 && 'is-expanded']">
    <div class="mdp-demo__preview">
      <slot />
    </div>
    <div
      class="mdp-demo__code"
      :style="{ height: height + 'px', visibility: height > 0 ? 'visible' : 'hidden' }"
    >
      <div ref="codeEl">
        <slot name="code" />
      </div>
    </div>
  </div>
</template>