import { createHash } from 'crypto';
import type { Transformer, Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Code, HTML, Parent } from 'mdast';
import path from 'path';

function md5(str: string): string {
  return createHash('md5').update(str).digest('hex');
}

// interface Code {
//   type: 'code'
//   lang?: string
//   meta?: string
// }

const fileCodeMap = new Map<string, string[]>();

export type CodeBlock = { name: string; path: string; code: string };

export type RemarkVueOptions = {
  file: string;
  root: string;
  remove: (ids: string[]) => void;
  update: (blocks: CodeBlock[]) => void;
  component?: string;
};
export function remarkVue(options: RemarkVueOptions): Plugin {
  const { file, root, remove, update, component = 'VueCode' } = options;

  const resolve = (...args: string[]) => {
    let ret = path.resolve(path.dirname(file), ...args);
    ret = path.relative(root, ret);
    return `/${ret}`;
  };
  function transformer(tree): Transformer {
    const oldBlocks = fileCodeMap.get(file) || [];
    const blocks: CodeBlock[] = [];
    visit(tree, 'code', (node: Code, i: number, parent: Parent) => {
      if (node.lang === 'vue') {
        const name = `VueCode${md5(file).substr(0, 8)}I${i}`;
        blocks.push({ name, path: resolve(`./${name}.vue`), code: node.value });
        const demoNode: HTML = {
          type: 'html',
          // ${JSON.stringify(node.value)}
          value: `<${component} source="${encodeURIComponent(node.value)}">
  <${name} />
</${component}>`
        };
        parent.children.splice(i, 1, demoNode);
      }
    });
    const names = blocks.map((i) => i.name);
    remove(oldBlocks);
    fileCodeMap.set(file, names);
    update(blocks);

    const imports = names.reduce((prev, curr) => {
      return `${prev}import ${curr} from "${resolve(`./${curr}.vue`)}"\n`;
    }, '');
    const script = `<script setup>\n${imports}</script>`;
    tree.children.splice(0, 0, { type: 'html', value: script });
    return tree;
  }

  return transformer;
}
