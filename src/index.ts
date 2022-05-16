import type { HmrContext, ModuleNode, Plugin, PluginOption, Update } from 'vite';
import { remark } from 'remark';
import { remarkVue } from './remark';
import path from 'path';
import { read } from 'fs';

const VUE_CODE_REGEXP = /VueCode[a-z0-9]{8}I\d{1,4}\.vue$/;
const vueBlockMap = new Map<string, string>();
let root = process.cwd();
let vuePlugin: any | undefined;

export function transform(code: string, file: string) {
  const ret = remark()
    .use(remarkVue, {
      file,
      root,
      remove(codePath) {
        for (const name of codePath) {
          console.log('remove', name);
          vueBlockMap.delete(`${name}.vue`);
        }
      },
      update(blocks) {
        for (const block of blocks) {
          console.log('update', block.path);
          if (block.name.indexOf('VueCode12c8f579I0') >= 0) {
            console.log(block.code);
          }
          vueBlockMap.set(`${block.path}`, block.code);
        }
      }
    })
    .processSync(code);

  return ret.value as unknown as string;
}

function VitePluginMdVue(): PluginOption[] {
  let config: Parameters<Exclude<Plugin['configResolved'], undefined>>[0];

  const plugin: Plugin = {
    name: 'vite:vue-code',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      root = config.root;
      vuePlugin = resolvedConfig.plugins.find((p) => p.name === 'vite:vue');
    },
    resolveId(id) {
      if (VUE_CODE_REGEXP.test(id)) {
        return `${id}`;
      }
    },
    load(id) {
      if (VUE_CODE_REGEXP.test(id)) {
        console.log('load', id);
        const code = vueBlockMap.get(id);
        if (id.indexOf('VueCode12c8f579I0') >= 0) {
          console.log(code);
        }
        return code;
      }
    },
    async handleHotUpdate(ctx) {
      const { file, server } = ctx;
      const { moduleGraph, ws } = server;
      console.log('handleHotUpdate', file);

      if (/\.md$/.test(file)) {
        const timestamp = Date.now();
        const updates: Update[] = [];
        for (const [name] of vueBlockMap) {
          const mods = [...(moduleGraph.getModulesByFile(name) || new Set())];

          // console.log(mods);
          for (const mod of mods) {
            mod.lastHMRTimestamp = timestamp;
            mod.lastInvalidationTimestamp = timestamp;
            // updates.push({
            //   type: `js-update`,
            //   timestamp,
            //   path: `${mod.url}`,
            //   acceptedPath: `${mod.url}`
            // });
          }
          // moduleGraph.onFileChange(name);
          // vuePlugin.handleHotUpdate({
          //   ...ctx,
          //   file: name,
          //   mods,
          //   read() {
          //     return vueBlockMap.get(name);
          //   }
          // });
        }
        // ws.send({
        //   type: 'update',
        //   updates
        // });
      }
    }
  };
  return [plugin];
}

export default VitePluginMdVue;
