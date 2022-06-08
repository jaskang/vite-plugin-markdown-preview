import { createInlineStyle } from '@yankeeinlondon/happy-wrapper'

export const script = `import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watchEffect,
  renderSlot,
  toDisplayString,
  openBlock,
  createElementBlock,
  createElementVNode,
} from 'vue'

const VueCode = defineComponent({
  props: {
    source: {
      type: String,
      default: '',
    },
  },
  setup() {
    const codeEl = ref()
    const wrapEl = ref()
    const isMounted = ref(false)
    const currentHeight = ref(0)
    const wrapHeight = computed(() => (isMounted.value ? currentHeight.value + 'px' : 'auto'))
    const click = () => {
      if (currentHeight.value > 0) {
        currentHeight.value = 0
      } else {
        const codeHeight = codeEl.value ? codeEl.value.offsetHeight : 0
        currentHeight.value = codeHeight
      }
    }
    watchEffect(() => {
      if (wrapEl.value) {
        wrapEl.value.style.height = wrapHeight.value
      }
    })
    onMounted(() => {
      const codeHeight = codeEl.value ? codeEl.value.offsetHeight : 0
      currentHeight.value = codeHeight
      isMounted.value = true
    })

    return {
      wrapEl,
      codeEl,
      currentHeight,
      click,
    }
  },
  render(_ctx, _cache) {
    return (
      openBlock(),
      createElementBlock('div', { class: 'vue-document' }, [
        createElementVNode('div', { class: 'vue-document__slot' }, [renderSlot(_ctx.$slots, 'default')]),
        createElementVNode(
          'div',
          { class: 'vue-document__wrap', ref: 'wrapEl' },
          [
            createElementVNode(
              'div',
              {
                class: 'vue-document__source',
                ref: 'codeEl',
                innerHTML: decodeURIComponent(_ctx.source),
              },
              null,
              8 /* PROPS */,
              ['innerHTML']
            ),
          ],
          512 /* NEED_PATCH */
        ),
        createElementVNode(
          'div',
          {
            class: 'vue-document__btn',
            onClick: _cache[0] || (_cache[0] = (...args) => _ctx.click && _ctx.click(...args)),
          },
          toDisplayString(_ctx.currentHeight > 0 ? 'hide' : 'show') + ' source',
          1 /* TEXT */
        ),
      ])
    )
  },
})`

export const style = createInlineStyle()
  .addClassDefinition('.vue-document', c =>
    c
      .addProps({
        'background-color': '#fff',
        border: '1px solid #ccc',
        overflow: 'hidden',
        'border-radius': '4px',
        'box-shadow': '4px 4px 4px rgb(0 0 0 / 10%)',
      })
      .addChild('.vue-document__slot', {
        width: '100',
        overflow: 'auto',
        padding: '10px',
      })
      .addChild('.vue-document__btn', {
        'text-align': 'center',
        padding: '10px',
        color: '#666',
        'margin-top': '-1px',
        'border-top': '1px solid #ccc',
      })
      .addChild('.vue-document__wrap', {
        'border-top': '1px solid #ccc',
        overflow: 'hidden',
        height: 'auto',
        transition: 'height 500ms',
      })
      .addChild('.vue-document__source .code-wrapper', {
        margin: 0,
      })
  )
  .finish()
