import { viteDocument } from './plugin'
import { fence } from './fence'

export interface documentConfig {}

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

export const plugin = () => viteDocument(vueBlockMap)

console.log('initializer')

export const document = createBuilder('document', 'parser')
  .options()
  .initializer(async (p: any, o: any) => {
    console.log('initializer')
    // i want register plugin here
    // p.viteConfig.plugins.push(plugin)
  })
  .handler(async (p: any, o: any) => {
    const { fileName, viteConfig } = p
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
