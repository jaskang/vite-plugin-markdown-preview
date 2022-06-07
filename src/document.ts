import { vitePluginDocument } from './plugin'
import { applyCodeAttributes } from './remark'

export interface documentConfig {}

// const componentName = 'VueDocument'
const vueBlockMap = new Map<string, string>()

export function createBuilder(name: string, lifecycle: string) {
  return {
    options: () => {
      return {
        initializer: (initializer?: any) => {
          return {
            handler: (handler: any) => {
              return {
                meta: (meta: any) => {
                  const registration: any = {
                    ...meta,
                    name,
                    lifecycle,
                    handler,
                    initializer,
                  }
                  return (options?: any) => () => ({ ...registration, options })
                },
              }
            },
          }
        },
      }
    },
  }
}
export const viewPlugin = () => vitePluginDocument(vueBlockMap)
export const viteDocument = createBuilder('document-initialize', 'initialize')
  .options()
  .initializer()
  .handler(async (p: any, o: any) => {
    const hasPlugin = p.viteConfig.plugins.some(v => {
      v.name === 'vite:md-document'
    })
    if (!hasPlugin) {
      p.viteConfig.plugins.unshift(viewPlugin)
    }
    return p
  })
  .meta({
    description: 'md-preview document vite',
  })

export const document = createBuilder('document', 'parser')
  .options()
  .initializer()
  .handler(async (p: any, o: any) => {
    const { fileName, viteConfig } = p
    p.parser.use(
      applyCodeAttributes({
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
