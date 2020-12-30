import path from 'path'
import fs from 'fs-extra'
import visit from 'unist-util-visit'
import { VFile } from 'vfile'

const debug = require('debug')('vite:vuedoc:remark-code-import')

function remarkCodeImport(options = {}) {
  return async function visitor(ast: Node, file: VFile) {
    const codes: [Node, number, Parent | undefined][] = []

    const promises: Array<Promise<void>> = []

    visit(ast, 'code', (node, index, parent) => {
      codes.push([node, index, parent])
    })

    for (const [node] of codes) {
      const fileMeta = (node.meta || '').split(' ').find((meta: string) => meta.startsWith('file='))
      if (!fileMeta) {
        continue
      }
      const filePath = fileMeta.slice('file='.length)
      const fileAbsPath = path.resolve(file.dirname || file.cwd, filePath)
      debug(`code import ${fileAbsPath}`)
      promises.push(
        fs.readFile(fileAbsPath, 'utf-8').then(fileContent => {
          node.value = fileContent.trim()
        })
      )
    }
    if (promises.length > 0) {
      await Promise.all(promises)
    }
  }
}

export default remarkCodeImport
