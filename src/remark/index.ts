import unified from 'unified'
import remarkCodeImport from './remarkCodeImport'
import remarkCodePrism from './remarkCodePrism'
import remarkFrontmatter from './remarkFrontmatter'

export { VueBlockType } from './remarkCodePrism'

const toVfile = require('to-vfile')

type remarkOption = {
  vuePrefix: string
  previewClass?: string
  plugins?: any[]
}

type DemoType = {
  id: string
  code: string
}

export const remarkFile = async (
  file: string,
  options: remarkOption
): Promise<{
  template: string
  matter: Record<string, any>
  vueBlocks: DemoType[]
}> => {
  const { vuePrefix, previewClass = '', plugins = [] } = options
  const vfile = await unified()
    .use({
      plugins: [
        [require('remark-parse')],
        [require('remark-frontmatter')],
        [remarkFrontmatter],
        [remarkCodeImport],
        [remarkCodePrism, { previewClass, vuePrefix: vuePrefix }],
        [require('remark-gemoji')],
        ...plugins,
        [require('remark-rehype'), { allowDangerousHtml: true }],
        [require('rehype-raw')],
        [require('rehype-stringify')]
      ]
    })
    .process(toVfile.readSync(file))
  const data: any = vfile.data || {}
  return {
    template: vfile.toString(),
    matter: data.matter || {},
    vueBlocks: data.vueBlocks || []
  }
}
