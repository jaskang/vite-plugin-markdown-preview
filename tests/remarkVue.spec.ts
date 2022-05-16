import path from 'path';
import { readFileSync } from 'fs-extra';

import { remark } from 'remark';
import { remarkVue } from '../src/remark';
test('remarkVue', async () => {
  const a = await remark()
    .use(remarkVue, { file: 'test.md' })
    .process(readFileSync(path.join(__dirname, './test.md')))
    .then((v) => {
      console.log(v.value);
    });
});
