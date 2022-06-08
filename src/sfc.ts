import { createBuilder } from './createBuilder'

export const sfcBuilder = createBuilder('vue-doc', 'sfcBlocksExtracted')
  .options()
  .initializer((payload, options) => {
    console.log('sfc initializer', payload, options)
  })
  .handler((payload, options) => {
    console.log('sfc handler')
    return payload
  })
  .meta({
    description: 'produce a code sample alongside a working example ...',
  })
