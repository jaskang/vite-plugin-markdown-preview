import type { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Markdown from 'vite-plugin-md';
import VitePluginRemark, { transform } from './src';

const config: UserConfig = {
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    vueJsx(),
    Markdown({
      transforms: {
        before: transform
      }
    }),
    VitePluginRemark()
  ]
};

export default config;
