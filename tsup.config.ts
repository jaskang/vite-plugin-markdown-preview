import { defineConfig } from 'tsup'
import pkg from './package.json'

function depsFilter(originDeps: string[], deps: string[] = []) {
  return originDeps.filter(dep => {
    return !deps.includes(dep)
  })
}

export default defineConfig(() => {
  // @ts-ignore
  const deps = pkg.dependencies || {}

  return {
    entryPoints: ['src/index.ts'],
    format: ['cjs', 'esm'],
    target: 'es2015',
    platform: 'browser',
    splitting: false,
    minify: false,
    sourcemap: true,
    clean: true,
    dts: {
      resolve: true,
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      __TEST__: 'false',
    },
    external: depsFilter(Object.keys(deps), []),
    banner: {
      js: `/**\n * name: ${pkg.name}\n * version: ${pkg.version}\n */`,
    },
    esbuildOptions(opts) {
      // opts.inject = (opts.inject || []).filter(p => !p.includes('_shims'))
    },
    silent: true,
    onSuccess: 'node scripts/mpBuild.js',
  }
})
