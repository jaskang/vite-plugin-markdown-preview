import { viteDocument } from './plugin'
import { fence } from './fence'
import { createBuilder } from './createBuilder'
import { script, style } from './component'

export interface documentConfig {}

const vueBlockMap = new Map<string, string>()

export const plugin = () => viteDocument(vueBlockMap)

export const document = createBuilder('document', 'parser')
  .options()
  .initializer()
  .handler(async (p: any, o: any) => {
    const { fileName, viteConfig } = p

    p.addCodeBlock('VueDocumentScript', script)
    p.addStyleBlock('VueDocumentStyle', style)

    p.parser.use(
      fence({
        root: viteConfig.root,
        file: fileName,
        update(block) {
          vueBlockMap.set(`${block.path}`, block.code)
        },
      })
    )
    return p
  })
  .meta({
    description: 'md-preview document',
  })
