import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  css: {},
  build: {
    lib: {
      entry: resolve(__dirname, 'src/component/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    outDir: resolve(__dirname, 'dist/component'),
    emptyOutDir: true,
    minify: true,
    sourcemap: 'inline',
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      rollupTypes: true,
    }),
  ],
})
