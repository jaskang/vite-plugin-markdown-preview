declare module '*.md' {
  import { Component } from 'vue'
  var component: Component
  export default component
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
