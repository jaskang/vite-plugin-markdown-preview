import { createVueDocPlugin } from './plugin'

export const vueDocFiles = [/\.vue$/, /\.md$/, /\.vd$/]

export const createPlugin = createVueDocPlugin

export default createVueDocPlugin
