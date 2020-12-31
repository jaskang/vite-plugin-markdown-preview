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

declare module 'markdown-it-emoji'
declare module 'markdown-it-sub'
declare module 'markdown-it-sup'
declare module 'markdown-it-footnote'
declare module 'markdown-it-deflist'
declare module 'markdown-it-abbr'
declare module 'markdown-it-ins'
declare module 'markdown-it-mark'
declare module 'markdown-it-latex'
declare module 'markdown-it-katex'
declare module 'markdown-it-toc-and-anchor'
declare module 'markdown-it-task-lists'
declare module 'markdown-it-source-map'
declare module 'markdown-it-container'
