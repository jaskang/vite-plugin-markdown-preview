import { inject, computed, defineComponent, PropType } from 'vue'

// import './Button.scss'

const Button = defineComponent({
  name: 'ElButton',
  props: {
    type: {
      type: String as PropType<'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text'>,
      default: 'default'
    },
    shape: {
      type: String as PropType<'round' | 'circle'>,
      default: ''
    },
    size: {
      type: String as PropType<'large' | 'small'>,
      default: ''
    },
    nativeType: { type: String as PropType<'button' | 'submit' | 'reset'>, default: 'button' },
    icon: { type: String, default: '' },
    loading: { type: Boolean },
    disabled: { type: Boolean }
  },
  setup(props, { emit, attrs, slots }) {
    const buttonSize = computed(() => {
      return props.size
    })
    const buttonDisabled = computed(() => {
      return props.disabled
    })

    return () => (
      <button
        disabled={buttonDisabled.value || props.loading}
        type={props.nativeType as 'button'}
        class={[
          'el-button',
          `el-button-${props.type}`,
          buttonSize.value ? 'el-button-' + buttonSize.value : '',
          props.shape ? `is-${props.shape}` : '',
          {
            'is-disabled': buttonDisabled.value,
            'is-loading': props.loading
          }
        ]}
        {...attrs}
      >
        {props.loading && <i class="el-icon-loading"></i>}
        {props.icon && !props.loading && <i class={props.icon}></i>}
        <span>{slots.default?.()}</span>
      </button>
    )
  }
})

export default Button
