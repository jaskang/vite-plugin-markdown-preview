<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  setup() {
    const codeEl = ref<HTMLDivElement>()
    const codeHeight = ref(0)
    const currentHeight = ref(codeHeight.value)
    const wrapHeight = computed(() => (codeHeight.value > 0 ? currentHeight.value + 'px' : 'auto'))
    const click = () => {
      if (currentHeight.value > 0) {
        currentHeight.value = 0
      } else {
        currentHeight.value = codeHeight.value
      }
    }
    onMounted(() => {
      codeHeight.value = codeEl.value?.offsetHeight || 0
      currentHeight.value = codeHeight.value
      console.log(codeHeight.value)
    })

    return {
      codeEl,
      currentHeight,
      wrapHeight,
      codeHeight,
      click,
    }
  },
})
</script>
<template>
  <div class="vue-code">
    <div class="vue-code__slot">
      <slot></slot>
    </div>
    <div class="vue-code__wrap">
      <div class="vue-code__source" ref="codeEl" v-html="decodeURIComponent(source)"></div>
    </div>
    <div class="vue-code__btn" @click="click">{{ currentHeight > 0 ? 'hide' : 'show' }} source</div>
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
}
.vue-code__btn {
  text-align: center;
  padding: 10px;
  color: #666;
  margin-top: -1px;
  border-top: 1px solid #ccc;
}
.vue-code__wrap {
  border-top: 1px solid #ccc;
  overflow: hidden;
  height: v-bind(wrapHeight);
  transition: height 500ms;
}
.vue-code__source {
  padding: 10px;
}
</style>
