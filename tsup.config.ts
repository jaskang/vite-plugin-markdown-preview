import { defineConfig } from 'tsup'
import pkg from './package.json'

export default defineConfig(() => {
  return {
    entryPoints: ['src/index.ts'],
    format: ['esm', 'cjs'],
    // target: 'es2019',
    shims: true,
    bundle: true,
    platform: 'node',
    splitting: false,
    minify: false,
    sourcemap: true,
    // noExternal: ['remark', 'unified', 'unist-util-visit'],
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
