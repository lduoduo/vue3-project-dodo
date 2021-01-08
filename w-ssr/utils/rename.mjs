import * as path from 'path';
import fs from 'fs';

const __dirname = '/' + path.dirname(import.meta.url).replace(/^file:\/\/\//, '');

const resolve = pn => path.join(__dirname, pn);

const json = fs.readFileSync(
  resolve('../../dist/vue-ssr-server-bundle.json'),
  'utf-8'
);

const t = json.replace(/\/esm\//g, '/');

fs.writeFile(resolve('../../dist/vue-ssr-server-bundle.json'), t, err => {
  if (err) throw err;
  console.log('去掉esm');
});
