import { resolveComponent, defineComponent, ref } from 'vue'

const ViteVueDocBlockStyles = `
:root{
  --vuedoc-border-color: var(--vp-c-divider-light-2, rgba(60, 60, 60, .12));
  --vuedoc-btn-bg-hover: var(--vp-c-gray-light-5, #f2f2f2);
}
.dark {
  --vuedoc-border-color: var(--vp-c-divider-dark-2, rgba(84, 84, 84, .48));
  --vuedoc-btn-bg-hover: var(--vp-c-gray-dark-3, #3a3a3a);
}
.vuedoc-demo {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--vuedoc-border-color);
}
.vuedoc-demo__preview {
  padding: 20px;
}
.vuedoc-demo__toolbar {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid var(--vuedoc-border-color);
}
.vuedoc-demo__btn {
  width: 38px;
  height: 100%;
  align-items: center;
  text-align: center;
  margin-left: 4px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}
.vuedoc-demo__btn:hover {
  background-color: var(--vuedoc-btn-bg-hover);
}

.vuedoc-demo__toolbar svg {
  width: 1rem;
  height: 1rem;
}

.vuedoc-demo.is-expanded .vuedoc-demo__code{
  border-top: 1px solid var(--vuedoc-border-color);
}

.vuedoc-demo__code div[class*='language-'] {
  margin: 0;
  border-radius: 0;
}
`

let shouldInjectStyle = true
function styleInject(css) {
  if (shouldInjectStyle) {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('vuedoc-style')
      if (!el) {
        const head = document.head || document.getElementsByTagName('head')[0]
        const style = document.createElement('style')
        style.setAttribute('type', 'text/css')
        style.setAttribute('id', 'vuedoc-style')
        if (style.styleSheet) {
          style.styleSheet.cssText = css
        } else {
          style.appendChild(document.createTextNode(css))
        }
        head.appendChild(style)
        shouldInjectStyle = false
      }
    }
  }
}

const VueDocBlock = defineComponent({
  name: 'VueDocBlock',
  props: {
    code: { type: String, required: true },
    lang: { type: String, required: true },
    meta: { type: String, required: true },
  },
  setup(props, { slots }) {
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
    return () => (
      <div class={['vuedoc-demo', height.value > 0 && 'is-expanded']}>
        <div class="vuedoc-demo__preview">{slots.default && slots.default()}</div>
        <div class="vuedoc-demo__toolbar">
          <div class="vuedoc-demo__btn vuedoc-demo__btn-copy" onClick={copyCode}>
            {copied.value ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                height="20"
                width="20"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                height="20"
                width="20"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
                />
              </svg>
            )}
          </div>
          <div class="vuedoc-demo__btn vuedoc-demo__btn-code" onClick={toggleCode}>
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="46"
                d="M160 368L32 256l128-112M352 368l128-112-128-112M304 96l-96 320"
              />
            </svg>
          </div>
        </div>
        <div class="vuedoc-demo__code" style={{ height: height.value + 'px' }}>
          <div ref={codeEl}>{slots.code && slots.code()}</div>
        </div>
      </div>
    )
  },
})

const VueDoc = defineComponent({
  name: 'VueDoc',
  props: {
    code: { type: String, required: true },
    lang: { type: String, required: true },
    meta: { type: String, default: '' },
    component: { type: String },
  },
  setup(props, { slots }) {
    styleInject(ViteVueDocBlockStyles)
    const DemoBlock = props.component ? resolveComponent(props.component) : VueDocBlock
    return () => (
      <DemoBlock
        code={decodeURIComponent(props.code)}
        lang={decodeURIComponent(props.lang)}
        meta={decodeURIComponent(props.meta)}
      >
        {{ default: slots.default, code: slots.code }}
      </DemoBlock>
    )
  },
})

export default VueDoc
