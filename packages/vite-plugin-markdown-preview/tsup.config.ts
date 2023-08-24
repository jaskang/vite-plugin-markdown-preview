import { defineConfig } from 'tsup'
import pkg from './package.json'

export default defineConfig(() => {
  return {
    entryPoints: ['src/index.ts'],
    format: ['esm'],
    skipNodeModulesBundle: true,
    platform: 'node',
    splitting: false,
    minify: false,
    sourcemap: true,
    clean: true,
    dts: true,
    define: {
      'process.env.NODE_ENV': '"production"',
      __TEST__: 'false',
    },
    banner: {
      js: `/**\n * name: ${pkg.name}\n * version: ${pkg.version}\n */`,
    },
  }
})
