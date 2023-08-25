import { createVNode, defineComponent, getCurrentInstance } from 'vue'

import CodePreview from './CodePreview.vue'

const CodePreviewWrapper = defineComponent({
  name: 'CodePreviewWrapper',
  props: {
    code: { type: String, required: true },
    lang: { type: String, required: true },
    meta: { type: String, default: '' },
    component: { type: String, default: 'CodePreview' },
  },
  setup(props, ctx) {
    const instance = getCurrentInstance()
    const Component = instance!.appContext.app.component(props.component)
    const DemoBlock = Component ? Component : CodePreview
    return () =>
      createVNode(
        DemoBlock,
        {
          code: decodeURIComponent(props.code),
          lang: decodeURIComponent(props.lang),
          meta: decodeURIComponent(props.meta),
        },
        {
          default: ctx.slots.default,
          code: ctx.slots.code,
        }
      )
  },
})

export { CodePreview, CodePreviewWrapper }
