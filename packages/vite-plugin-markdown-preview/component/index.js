import { defineComponent, createVNode, getCurrentInstance } from 'vue'
import CodePreview from './CodePreview.vue'

const MarkdownPreview = defineComponent({
  name: 'MarkdownPreview',
  props: {
    code: { type: String, required: true },
    lang: { type: String, required: true },
    meta: { type: String, default: '' },
    component: { type: String, default: 'CodePreview' },
  },
  setup(props, ctx) {
    const instance = getCurrentInstance()
    const Component = instance.appContext.app.component(props.component)
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

export default MarkdownPreview
