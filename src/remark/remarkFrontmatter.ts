// import visit from 'unist-util-visit'
import map from 'unist-util-map'
import { VFile } from 'vfile'
const yaml = require('js-yaml')

const debug = require('debug')('vite:vuedoc:remarkFrontmatter')

function remarkFrontmatter() {
  return function visitor(ast: Node, file: VFile) {
    if (!file.data) {
      file.data = {}
    }
    const data: any = file.data
    return map(ast, (node: Node) => {
      if (node.type == 'yaml') {
        const parsedValue = yaml.safeLoad(node.value, 'utf8')
        debug(`${file.name} -> frontmatter:${parsedValue}`)
        data.matter = parsedValue
        const newNode = Object.assign({}, node, { data: { parsedValue } })
        return newNode
      } else {
        return node
      }
    })
  }
}

export default remarkFrontmatter
