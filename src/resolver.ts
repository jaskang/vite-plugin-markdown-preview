// import path from 'path'
import { Resolver } from 'vite'
// const slash = require('slash')
// const debug = require('debug')('vite:vuedoc:resolver')

export const VUEDOC_PREFIX = 'vdpv_'
export const VUEDOC_RE = /(.*?\.md)[\/|\\](vdpv_\d+)/

export function createResolver(): Resolver {
  return {
    // requestToFile(publicPath, root) {
    //   if (publicPath.endsWith('.md') || VUEDOC_RE.test(publicPath)) {
    //     let file = path.resolve(root, publicPath.slice(1))
    //     if (publicPath.indexOf(root) === 0) {
    //       file = publicPath
    //     }
    //     debug(`requestToFile publicPath:${publicPath} root:${root} file:${file}`)
    //     return file
    //   }
    // },
    // fileToRequest(filePath, root) {
    //   if (filePath.endsWith('.md')) {
    //     const request = '/' + slash(path.relative(root, filePath))
    //     debug(`fileToRequest filePath:${filePath} root:${root} request:${request}`)
    //     return request
    //   }
    // }
  }
}
