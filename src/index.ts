import type { Plugin, PluginOption } from 'vite';
import { remark } from 'remark';
import { remarkVue } from './remark';

const vueBlockMap = new Map<string, string>();

export function transform(code: string, file: string) {
  const ret = remark()
    .use(remarkVue, {
      file,
      remove(codePath) {
        for (const name of codePath) {
          console.log('remove', name);
          vueBlockMap.delete(`${name}.vue`);
        }
      },
      update(blocks) {
        for (const block of blocks) {
          console.log('update', block.name);
          vueBlockMap.set(`${block.name}.vue`, block.code);
        }
      }
    })
    .processSync(code);

  return ret.value as unknown as string;
}

const VUE_CODE_REGEXP = /VueCode[a-z0-9]{16}\.vue$/;
function VitePluginMdVue(): PluginOption[] {
  const plugin: Plugin = {
    name: 'vite:vue-code',
    enforce: 'pre',
    resolveId(id) {
      if (VUE_CODE_REGEXP.test(id)) {
        return id;
      }
    },
    load(id) {
      if (VUE_CODE_REGEXP.test(id)) {
        return vueBlockMap.get(id);
      }
    }
  };
  return [plugin];
}

export default VitePluginMdVue;
